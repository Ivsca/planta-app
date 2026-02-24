// context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import { clearAvatarUri } from "../app/profile/avatarStorage";

/* ─── Tipos ─── */
export type UserRole = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;

  updateProfile: (data: {
    name?: string;
    password?: string;
  }) => Promise<{ ok: boolean; error?: string }>;

  deleteAccount: () => Promise<{ ok: boolean; error?: string }>;

  logout: () => Promise<void>;

  /**
   * Helper recomendado: úsalo cuando un endpoint devuelva 401
   * para limpiar sesión y evitar loops.
   */
  handleUnauthorized: () => Promise<void>;
};

/* ─── URL base del backend ─── */
import { API_BASE } from "../constants/api";


const AuthContext = createContext<AuthState | undefined>(undefined);

/* ─── Storage (web usa localStorage, nativo usa AsyncStorage) ─── */
const storage = {
  async get(key: string) {
    if (Platform.OS === "web") return localStorage.getItem(key);
    return AsyncStorage.getItem(key);
  },
  async set(key: string, value: string) {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  async remove(key: string) {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

function isUserRole(v: unknown): v is UserRole {
  return v === "user" || v === "admin";
}

function normalizeUser(raw: any): User | null {
  if (!raw || typeof raw !== "object") return null;

  const id = typeof raw.id === "string" ? raw.id : null;
  const name = typeof raw.name === "string" ? raw.name : null;
  const email = typeof raw.email === "string" ? raw.email : null;
  const role = raw.role;

  if (!id || !name || !email) return null;
  if (!isUserRole(role)) return null; 

  return { id, name, email, role };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(async () => {
    const uid = user?.id;

    setUser(null);
    setToken(null);

    await storage.remove("auth_token");
    await storage.remove("auth_user");

    if (uid) await clearAvatarUri(uid);
  }, [user?.id]);

  const persistSession = useCallback(async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    await storage.set("auth_token", newToken);
    await storage.set("auth_user", JSON.stringify(newUser));
  }, []);

  /* Recuperar sesión guardada al iniciar */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const savedToken = await storage.get("auth_token");
        const savedUserStr = await storage.get("auth_user");

        if (!alive) return;

        if (savedToken && savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          const normalized = normalizeUser(parsed);

          if (normalized) {
            setToken(savedToken);
            setUser(normalized);
          } else {
            // si está corrupto, limpiamos
            await storage.remove("auth_token");
            await storage.remove("auth_user");
          }
        }
      } catch {
        // si storage falla, no bloquees la app
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  /* ── Login ── */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { ok: false, error: data?.error || "Error al iniciar sesión" };
      }

      const newToken = typeof data?.token === "string" ? data.token : null;
      const newUser = normalizeUser(data?.user);

      if (!newToken || !newUser) {
        return {
          ok: false,
          error: "Respuesta inválida del servidor (token/user).",
        };
      }

      await persistSession(newToken, newUser);
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  }, [persistSession]);

  /* ── Register ── */
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          return { ok: false, error: data?.error || "Error al registrarse" };
        }

        const newToken = typeof data?.token === "string" ? data.token : null;
        const newUser = normalizeUser(data?.user);

        if (!newToken || !newUser) {
          return {
            ok: false,
            error: "Respuesta inválida del servidor (token/user).",
          };
        }

        await persistSession(newToken, newUser);
        return { ok: true };
      } catch {
        return { ok: false, error: "No se pudo conectar al servidor" };
      }
    },
    [persistSession]
  );

  /* ── Logout ── */
  const logout = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  /**
   * Úsalo cuando fetch devuelva 401:
   * - limpia sesión
   * - evita que pantallas se queden intentando con token inválido
   */
  const handleUnauthorized = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  /* ── Update Profile ── */
  const updateProfile = useCallback(
    async (data: { name?: string; password?: string }) => {
      try {
        if (!token) return { ok: false, error: "No autenticado" };

        const res = await fetch(`${API_BASE}/auth/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const json = await res.json().catch(() => ({}));

        if (res.status === 401) {
          await handleUnauthorized();
          return { ok: false, error: "Sesión expirada. Inicia sesión de nuevo." };
        }

        if (!res.ok) {
          return { ok: false, error: json?.error || "Error al actualizar" };
        }

        // Preserva campos no devueltos por el backend
        const normalized = normalizeUser(json?.user);
        if (!normalized) {
          // si el backend devuelve parcial, preservamos lo anterior
          if (!user) return { ok: false, error: "Estado de usuario inválido" };

          const updatedUser: User = {
            id: user.id,
            name: typeof json?.user?.name === "string" ? json.user.name : user.name,
            email: typeof json?.user?.email === "string" ? json.user.email : user.email,
            role: isUserRole(json?.user?.role) ? json.user.role : user.role,
          };

          setUser(updatedUser);
          await storage.set("auth_user", JSON.stringify(updatedUser));
          return { ok: true };
        }

        setUser(normalized);
        await storage.set("auth_user", JSON.stringify(normalized));
        return { ok: true };
      } catch {
        return { ok: false, error: "No se pudo conectar al servidor" };
      }
    },
    [token, user, handleUnauthorized]
  );

  /* ── Delete Account ── */
  const deleteAccount = useCallback(async () => {
    try {
      if (!token) return { ok: false, error: "No autenticado" };

      const res = await fetch(`${API_BASE}/auth/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        await handleUnauthorized();
        return { ok: false, error: "Sesión expirada. Inicia sesión de nuevo." };
      }

      if (!res.ok) {
        return { ok: false, error: json?.error || "Error al eliminar cuenta" };
      }

      await clearSession();
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  }, [token, clearSession, handleUnauthorized]);

  const isAuthenticated = useMemo(() => {
    
    return !!token && !!user;
  }, [token, user]);

  const value: AuthState = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    updateProfile,
    deleteAccount,
    logout,
    handleUnauthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
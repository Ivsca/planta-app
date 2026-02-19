import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

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
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (data: {
    name?: string;
    password?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  deleteAccount: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const API_BASE = "https://planta-app.onrender.com/api";

// const API_BASE = "http://10.7.64.107:5000/api";

const AuthContext = createContext<AuthState | undefined>(undefined);

/* ─── Almacenamiento simple (web usa localStorage, nativo usa AsyncStorage) ─── */
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* Recuperar sesión guardada al iniciar */
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await storage.get("auth_token");
        const savedUser = await storage.get("auth_user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser) as User);
        }
      } catch {
        /* ignorar errores de storage */
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /* ── Login ── */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("LOGIN RAW RESPONSE:", data);
      console.log("LOGIN USER:", data?.user);

      if (!res.ok) {
        return { ok: false, error: data.error || "Error al iniciar sesión" };
      }

      // ✅ Esperamos que el backend devuelva user.role
      setToken(data.token);
      setUser(data.user as User);
      await storage.set("auth_token", data.token);
      await storage.set("auth_user", JSON.stringify(data.user));
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  }, []);

  /* ── Register ── */
  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          return { ok: false, error: data.error || "Error al registrarse" };
        }

        setToken(data.token);
        setUser(data.user as User);
        await storage.set("auth_token", data.token);
        await storage.set("auth_user", JSON.stringify(data.user));
        return { ok: true };
      } catch {
        return { ok: false, error: "No se pudo conectar al servidor" };
      }
    },
    [],
  );

  /* ── Logout ── */
  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await storage.remove("auth_token");
    await storage.remove("auth_user");
  }, []);

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

        const json = await res.json();

        if (!res.ok) {
          return { ok: false, error: json.error || "Error al actualizar" };
        }

        // ⚠️ Si tu backend no devuelve role en /auth/me, lo preservamos del estado actual.
        const serverUser = json.user as Partial<User>;
        const updatedUser: User = {
          id: serverUser.id ?? user!.id,
          name: serverUser.name ?? user!.name,
          email: serverUser.email ?? user!.email,
          role: serverUser.role ?? user!.role,
        };

        setUser(updatedUser);
        await storage.set("auth_user", JSON.stringify(updatedUser));
        return { ok: true };
      } catch {
        return { ok: false, error: "No se pudo conectar al servidor" };
      }
    },
    [token, user],
  );

  /* ── Delete Account ── */
  const deleteAccount = useCallback(async () => {
    try {
      if (!token) return { ok: false, error: "No autenticado" };

      const res = await fetch(`${API_BASE}/auth/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();

      if (!res.ok) {
        return { ok: false, error: json.error || "Error al eliminar cuenta" };
      }

      setUser(null);
      setToken(null);
      await storage.remove("auth_token");
      await storage.remove("auth_user");
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        updateProfile,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

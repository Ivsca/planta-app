import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

/* ─── Tipos ─── */
export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (data: { name?: string; password?: string }) => Promise<{ ok: boolean; error?: string }>;
  deleteAccount: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

/* ─── URL base del backend ─── */
// Tunnel público (Cloudflare) para que el celular pueda conectarse al backend
// desde cualquier red. Para regenerar: npx cloudflared tunnel --url http://localhost:5000
const TUNNEL_URL = "https://picking-flashers-taught-effective.trycloudflare.com/api";

// IP local como fallback para cuando estés en la misma red
const LOCAL_IP = "10.7.68.211";

const API_BASE =
  Platform.OS === "web"
    ? "http://localhost:5000/api"          // Web → localhost
    : TUNNEL_URL;                          // Celular físico → tunnel público

const AuthContext = createContext<AuthState | undefined>(undefined);

/* ─── Almacenamiento simple (web usa localStorage, nativo usa AsyncStorage) ─── */
const storage = {
  async get(key: string) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
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

/* ─── Provider ─── */
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
          setUser(JSON.parse(savedUser));
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

      if (!res.ok) {
        return { ok: false, error: data.error || "Error al iniciar sesión" };
      }

      setToken(data.token);
      setUser(data.user);
      await storage.set("auth_token", data.token);
      await storage.set("auth_user", JSON.stringify(data.user));
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  }, []);

  /* ── Register ── */
  const register = useCallback(async (name: string, email: string, password: string) => {
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
      setUser(data.user);
      await storage.set("auth_token", data.token);
      await storage.set("auth_user", JSON.stringify(data.user));
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    await storage.remove("auth_token");
    await storage.remove("auth_user");
  }, []);

  /* ── Update Profile ── */
  const updateProfile = useCallback(async (data: { name?: string; password?: string }) => {
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

      // Actualizar estado local con los datos nuevos
      const updatedUser = json.user as User;
      setUser(updatedUser);
      await storage.set("auth_user", JSON.stringify(updatedUser));
      return { ok: true };
    } catch {
      return { ok: false, error: "No se pudo conectar al servidor" };
    }
  }, [token]);

  /* ── Delete Account ── */
  const deleteAccount = useCallback(async () => {
    try {
      if (!token) return { ok: false, error: "No autenticado" };

      const res = await fetch(`${API_BASE}/auth/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();

      if (!res.ok) {
        return { ok: false, error: json.error || "Error al eliminar cuenta" };
      }

      // Limpiar sesión
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

/* ─── Hook para usar el contexto ─── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

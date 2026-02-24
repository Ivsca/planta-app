// features/admin/adminApi.ts
import type { User } from "@/context/AuthContext";

export type AdminUserRow = Pick<User, "id" | "name" | "email" | "role"> & {
  createdAt?: string;
};

export type ListUsersResponse = {
  page: number;
  limit: number;
  total: number;
  users: AdminUserRow[];
};

export async function adminListUsers(params: {
  apiBase: string;
  token: string;
  search?: string;
  page?: number;
  limit?: number;
  on401: () => Promise<void>;
}): Promise<
  | { ok: true; data: ListUsersResponse }
  | { ok: false; error: string; status?: number }
> {
  const { apiBase, token, search = "", page = 1, limit = 20, on401 } = params;

  const url = new URL(`${apiBase}/admin/users`);
  if (search.trim()) url.searchParams.set("search", search.trim());
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return { ok: false, error: "No se pudo conectar al servidor" };
  }

  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    await on401();
    return {
      ok: false,
      status: 401,
      error: "Sesión expirada. Inicia sesión de nuevo.",
    };
  }

  if (res.status === 403) {
    return { ok: false, status: 403, error: "No autorizado (solo admin)." };
  }

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: json?.error || "Error al cargar usuarios",
    };
  }

  return { ok: true, data: json as ListUsersResponse };
}
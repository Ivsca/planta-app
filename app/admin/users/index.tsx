// app/admin/users/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../../context/AuthContext";
import { adminListUsers } from "../../../features/admin/adminApi";
import type { AdminUserRow } from "../../../features/admin/adminApi";

const API_BASE = "http://10.7.64.107:5000/api";

function formatShortDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function AdminUsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { token, handleUnauthorized } = useAuth();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState<AdminUserRow[]>([]);

  const trimmed = useMemo(() => search.trim(), [search]);

  const canPrev = page > 1;
  const canNext = page * limit < total;

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!token) {
        if (alive) setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const resp = await adminListUsers({
        apiBase: API_BASE,
        token,
        search: trimmed,
        page,
        limit,
        on401: handleUnauthorized,
      });

      if (!alive) return;

      if (!resp.ok) {
        setError(resp.error);
        setUsers([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      setUsers(resp.data.users);
      setTotal(resp.data.total);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [token, trimmed, page, handleUnauthorized]);

  const shownFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const shownTo = Math.min(page * limit, total);

  return (
    <View
      style={[
        styles.container,
        {
          // ✅ evita que hora/batería tapen el título
          paddingTop: insets.top + 16,
          // ✅ y no pegues el pager al borde inferior en iPhone con home indicator
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>Polinizadores</Text>
          <Text style={styles.sub}>
            {loading
              ? "Cargando…"
              : total === 0
                ? "Sin usuarios para mostrar"
                : `Mostrando ${shownFrom}-${shownTo} de ${total}`}
          </Text>
        </View>

        <View style={styles.pagePill}>
          <MaterialIcons
            name="groups"
            size={16}
            color="rgba(255,255,255,0.80)"
          />
          <Text style={styles.pagePillText}>Pág. {page}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MaterialIcons
            name="search"
            size={18}
            color="rgba(255,255,255,0.55)"
          />
          <TextInput
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              setPage(1);
            }}
            placeholder="Buscar por nombre o email…"
            placeholderTextColor="rgba(255,255,255,0.45)"
            style={styles.input}
            autoCapitalize="none"
          />
          {search.length > 0 ? (
            <Pressable
              onPress={() => {
                setSearch("");
                setPage(1);
              }}
              style={styles.clearBtn}
              accessibilityLabel="Limpiar búsqueda"
            >
              <MaterialIcons
                name="close"
                size={16}
                color="rgba(255,255,255,0.80)"
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.alert}>
          <MaterialIcons name="error-outline" size={18} color="#ff6b6b" />
          <Text style={styles.alertText}>{error}</Text>
        </View>
      ) : null}

      {/* List */}
      <FlatList
        data={users}
        keyExtractor={(u) => u.id}
        contentContainerStyle={{
          paddingBottom: 24,
          flexGrow: users.length ? 0 : 1,
        }}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.empty}>
              <MaterialIcons
                name="person-search"
                size={32}
                color="rgba(255,255,255,0.35)"
              />
              <Text style={styles.emptyTitle}>
                {trimmed ? "Sin resultados" : "No hay usuarios"}
              </Text>
              <Text style={styles.emptyText}>
                {trimmed
                  ? "Prueba con otro nombre o correo."
                  : "Aún no hay usuarios registrados."}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/admin/users/[id]",
                params: { id: item.id },
              })
            }
            style={styles.row}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.rowTop}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>

                <View
                  style={[
                    styles.badge,
                    item.role === "admin"
                      ? styles.badgeAdmin
                      : styles.badgeUser,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.role === "admin" ? "admin" : "user"}
                  </Text>
                </View>
              </View>

              <Text style={styles.dim} numberOfLines={1}>
                {item.email}
              </Text>

              <Text style={styles.meta}>
                Creado: {formatShortDate(item.createdAt)}
              </Text>
            </View>

            <MaterialIcons
              name="chevron-right"
              size={22}
              color="rgba(255,255,255,0.35)"
            />
          </Pressable>
        )}
      />

      {/* Pager */}
      <View style={styles.pager}>
        <Pressable
          onPress={() => canPrev && setPage((p) => p - 1)}
          style={[styles.btn, !canPrev && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>Anterior</Text>
        </Pressable>

        <Text style={styles.pagerText}>
          {total === 0 ? "—" : `${page} / ${Math.max(1, Math.ceil(total / limit))}`}
        </Text>

        <Pressable
          onPress={() => canNext && setPage((p) => p + 1)}
          style={[styles.btn, !canNext && styles.btnDisabled]}
        >
          <Text style={styles.btnText}>Siguiente</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ⚠️ No pongas paddingTop fijo aquí; lo calculamos con insets.top
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#07070A",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  h1: { color: "white", fontSize: 22, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.60)", marginTop: 4 },

  pagePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pagePillText: { color: "rgba(255,255,255,0.85)", fontWeight: "800" },

  searchRow: { marginBottom: 10 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: { flex: 1, color: "white", paddingVertical: 6 },
  clearBtn: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  alert: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.35)",
    backgroundColor: "rgba(255,107,107,0.10)",
    marginBottom: 10,
  },
  alertText: { color: "rgba(255,255,255,0.90)", fontWeight: "700", flex: 1 },

  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
    marginBottom: 10,
  },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  name: { color: "white", fontSize: 16, fontWeight: "800", flex: 1 },
  dim: { color: "rgba(255,255,255,0.65)", marginTop: 4 },
  meta: {
    color: "rgba(255,255,255,0.45)",
    marginTop: 6,
    fontWeight: "700",
    fontSize: 12,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeAdmin: {
    backgroundColor: "rgba(19,236,91,0.12)",
    borderColor: "rgba(19,236,91,0.30)",
  },
  badgeUser: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
  },
  badgeText: { color: "white", fontWeight: "800", fontSize: 12 },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyTitle: { color: "white", fontWeight: "900", fontSize: 16, marginTop: 10 },
  emptyText: { color: "rgba(255,255,255,0.60)", marginTop: 6, textAlign: "center" },

  pager: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  pagerText: { color: "rgba(255,255,255,0.60)", fontWeight: "800" },

  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "rgba(19,236,91,0.15)",
  },
  btnDisabled: { opacity: 0.35 },
  btnText: { color: "white", fontWeight: "800" },
});
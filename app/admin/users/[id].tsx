// app/admin/users/[id].tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../../context/AuthContext";
import type { AdminUserRow } from "../../../features/admin/adminApi";
import { adminListUsers } from "../../../features/admin/adminApi";

const API_BASE = "http://10.7.64.107:5000/api";

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function AdminUserDetail() {
  const insets = useSafeAreaInsets();

  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = String(id || "");

  const { token, handleUnauthorized } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUserRow | null>(null);

  const roleLabel = useMemo(
    () => (user?.role === "admin" ? "Administrador" : "Usuario"),
    [user?.role],
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!token) {
        if (alive) {
          setLoading(false);
          setError("No autenticado");
        }
        return;
      }

      setLoading(true);
      setError(null);

      // ⚠️ No tenemos endpoint /:id todavía.
      // Pedimos un lote y buscamos el id exacto.
      const resp = await adminListUsers({
        apiBase: API_BASE,
        token,
        search: "",
        page: 1,
        limit: 100,
        on401: handleUnauthorized,
      });

      if (!alive) return;

      if (!resp.ok) {
        setError(resp.error);
        setUser(null);
        setLoading(false);
        return;
      }

      const found =
        resp.data.users.find((u) => String(u.id) === userId) || null;

      if (!found) {
        setError("No se encontró el usuario (quizá fue eliminado).");
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(found);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [token, userId, handleUnauthorized]);

  const copy = async (value: string) => {
    await Clipboard.setStringAsync(value);
  };

  return (
    <View
      style={[
        styles.container,
        {
          // ✅ evita que hora/batería tapen el título
          paddingTop: insets.top + 16,
          // ✅ evita que el contenido quede pegado al home indicator
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <Text style={styles.h1}>Detalle de polinizador</Text>

      {loading ? <Text style={styles.dim}>Cargando…</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {user ? (
        <>
          {/* Identity card */}
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.dim}>{user.email}</Text>
              </View>

              <View
                style={[
                  styles.badge,
                  user.role === "admin"
                    ? styles.badgeAdmin
                    : styles.badgeUser,
                ]}
              >
                <Text style={styles.badgeText}>{roleLabel}</Text>
              </View>
            </View>

            <View style={styles.kv}>
              <Text style={styles.k}>ID</Text>
              <Text style={styles.v} numberOfLines={1}>
                {user.id}
              </Text>
              <Pressable
                onPress={() => copy(user.id)}
                style={styles.iconBtn}
                accessibilityLabel="Copiar ID"
              >
                <MaterialIcons
                  name="content-copy"
                  size={18}
                  color="rgba(255,255,255,0.80)"
                />
              </Pressable>
            </View>

            <View style={styles.sep} />

            <View style={styles.kv}>
              <Text style={styles.k}>Creado</Text>
              <Text style={styles.v}>{formatDate(user.createdAt)}</Text>
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Acciones rápidas</Text>

            <Pressable
              style={styles.action}
              onPress={() => copy(user.email)}
              accessibilityLabel="Copiar email"
            >
              <MaterialIcons
                name="alternate-email"
                size={18}
                color="rgba(255,255,255,0.80)"
              />
              <Text style={styles.actionText}>Copiar email</Text>
            </Pressable>

            <Pressable
              style={styles.action}
              onPress={() => copy(user.id)}
              accessibilityLabel="Copiar id"
            >
              <MaterialIcons
                name="fingerprint"
                size={18}
                color="rgba(255,255,255,0.80)"
              />
              <Text style={styles.actionText}>Copiar ID</Text>
            </Pressable>

            {Platform.OS === "web" ? (
              <Text style={styles.hint}>
                Tip: en web el portapapeles depende de permisos del navegador.
              </Text>
            ) : null}
          </View>

          {/* Placeholder for future sections */}
          <View style={styles.cardMuted}>
            <Text style={styles.cardTitle}>Próximamente</Text>
            <Text style={styles.dim}>
              Aquí puedes mostrar progreso (artículos/rutinas/retos completados),
              racha y última actividad. Eso requiere ampliar el endpoint del
              backend.
            </Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // ⚠️ No pongas paddingTop fijo aquí; lo calculamos con insets.top
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#07070A" },
  h1: { color: "white", fontSize: 22, fontWeight: "800", marginBottom: 12 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 14,
    marginTop: 12,
  },
  cardMuted: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    marginTop: 12,
  },
  cardTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  cardTitle: { color: "white", fontWeight: "800", marginBottom: 10 },

  name: { color: "white", fontSize: 18, fontWeight: "800" },
  dim: { color: "rgba(255,255,255,0.60)", marginTop: 2 },
  error: { color: "#ff6b6b", marginTop: 6 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
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

  kv: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
  k: { width: 58, color: "rgba(255,255,255,0.55)", fontWeight: "800" },
  v: { flex: 1, color: "rgba(255,255,255,0.90)" },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginTop: 12,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  actionText: { color: "white", fontWeight: "800" },
  hint: { marginTop: 10, color: "rgba(255,255,255,0.55)" },
});
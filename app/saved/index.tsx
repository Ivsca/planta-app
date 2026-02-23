// app/saved/index.tsx
import React, { useCallback, useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

import { Stitch } from "../../constants/theme";
import { GlassCard } from "../../components/ui/GlassCard";
import { useAuth } from "../../context/AuthContext";

import { FEATURED, FEED } from "@/features/content/data/content.mock";
import type { ContentItem } from "@/features/content/types";
import { getSavedIds, toggleSavedId } from "@/features/content/savedStorage";

function toImageSource(thumb: ContentItem["thumbnail"]) {
  if (!thumb) return undefined;
  return typeof thumb === "string" ? { uri: thumb } : thumb;
}

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const allItems = useMemo<ContentItem[]>(() => {
    // mismo patrón que el dispatcher
    return [...FEATURED, ...FEED];
  }, []);

  const savedItems = useMemo(() => {
    const set = new Set(savedIds);
    return allItems.filter((x) => set.has(x.id));
  }, [savedIds, allItems]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      if (!isAuthenticated || !user?.id) {
        setSavedIds([]);
        return;
      }
      const ids = await getSavedIds(user.id);
      setSavedIds(ids);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // ✅ recarga al entrar y al volver a esta pantalla
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        await refresh();
      })();

      return () => {
        alive = false;
        void alive; // evita lint por variable no usada si lo tienes estricto
      };
    }, [refresh]),
  );

  const open = useCallback(
    (id: string) => {
      router.push(`/content/${id}`);
    },
    [router],
  );

  const onUnsave = useCallback(
    async (id: string) => {
      if (!user?.id) return;

      // Optimistic UI
      setSavedIds((prev) => prev.filter((x) => x !== id));

      try {
        const res = await toggleSavedId(user.id, id);
        setSavedIds(res.ids);
      } catch {
        // Revert si falló
        await refresh();
      }
    },
    [user?.id, refresh],
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <MaterialIcons name="chevron-left" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.h1}>Contenido guardado</Text>
        <Pressable onPress={refresh} style={styles.iconBtn} hitSlop={10} accessibilityRole="button">
          <MaterialIcons name="refresh" size={20} color={Stitch.colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!isAuthenticated ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Inicia sesión</Text>
            <Text style={styles.emptySub}>
              Necesitas iniciar sesión para ver tu contenido guardado.
            </Text>
            <View style={{ height: 12 }} />
            <Pressable
              style={styles.primaryBtn}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <Text style={styles.muted}>Cargando…</Text>
        ) : savedItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Aún no tienes guardados</Text>
            <Text style={styles.emptySub}>
              En Descubrir toca “Guardar” para que aparezcan aquí.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {savedItems.map((item) => {
              const thumb = toImageSource(item.thumbnail);

              return (
                <GlassCard key={item.id} style={styles.card}>
                  <Pressable onPress={() => open(item.id)} style={styles.row}>
                    <View style={styles.thumbWrap}>
                      {thumb ? (
                        <Image source={thumb} style={styles.thumb} />
                      ) : (
                        <View style={styles.thumbFallback}>
                          <MaterialIcons name="image" size={18} color="rgba(255,255,255,0.30)" />
                        </View>
                      )}
                    </View>

                    <View style={styles.rowBody}>
                      <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.meta} numberOfLines={1}>
                        {item.type.toUpperCase()} • {item.isNew ? "Nuevo" : "Reciente"}
                      </Text>
                    </View>

                    <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.30)" />
                  </Pressable>

                  <View style={styles.divider} />

                  <Pressable onPress={() => onUnsave(item.id)} style={styles.unsaveRow}>
                    <MaterialIcons name="bookmark" size={18} color={Stitch.colors.primary} />
                    <Text style={styles.unsaveText}>Quitar de guardados</Text>
                  </Pressable>
                </GlassCard>
              );
            })}
          </View>
        )}

        <View style={{ height: 18 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Stitch.colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(33,196,93,0.10)",
  },
  h1: { flex: 1, color: "#fff", fontSize: 18, fontWeight: "900" },

  body: { padding: 16 },

  muted: { color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: "600" },

  emptyWrap: {
    paddingTop: 18,
    paddingHorizontal: 4,
  },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  emptySub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  primaryBtn: {
    alignSelf: "flex-start",
    backgroundColor: Stitch.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryBtnText: { color: Stitch.colors.bg, fontSize: 13, fontWeight: "900" },

  card: { borderRadius: 18, overflow: "hidden", paddingVertical: 2 },

  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  thumbWrap: {
    width: 84,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  thumb: { width: "100%", height: "100%" },
  thumbFallback: { flex: 1, alignItems: "center", justifyContent: "center" },

  rowBody: { flex: 1, minWidth: 0 },
  title: { color: "#fff", fontSize: 14, fontWeight: "800" },
  meta: {
    marginTop: 6,
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 14,
    marginRight: 14,
  },

  unsaveRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unsaveText: { color: Stitch.colors.primary, fontSize: 13, fontWeight: "800" },
});

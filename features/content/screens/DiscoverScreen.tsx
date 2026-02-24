// features/content/screens/DiscoverScreen.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getCategoryTheme } from "../../../features/articles/categoryTheme";
import { CATEGORY_LABEL, type CategoryId } from "../category";

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ImageSourcePropType,
} from "react-native";

import { API_BASE } from "../../../constants/api";
import { Stitch } from "../../../constants/theme";
import { formatViews } from "../selectors";
import type { ContentItem } from "../types";

import { useAuth } from "../../../context/AuthContext";
import { useRequireAuth } from "../../../hooks/use-require-auth";
import { getSavedIds, toggleSavedId } from "../savedStorage";

type UiTypeChip = "Todo" | "Video" | "Artículo" | "Rutina" | "Reto" | "Podcast";

const TYPE_CHIPS: UiTypeChip[] = [
  "Todo",
  "Video",
  "Artículo",
  "Rutina",
  "Reto",
  "Podcast",
];

function badgeForFeatured(item: ContentItem, idx: number) {
  if (item.isNew) return "Nuevo";
  if (idx === 0) return "Destacado";
  return "Recomendado";
}

function typeLabel(t: ContentItem["type"]) {
  switch (t) {
    case "video":
      return "Video";
    case "article":
      return "Artículo";
    case "routine":
      return "Rutina";
    case "challenge":
      return "Reto";
    case "podcast":
      return "Podcast";
    default:
      return "Contenido";
  }
}

function typeToDomain(t: UiTypeChip): ContentItem["type"] | "all" {
  switch (t) {
    case "Video":
      return "video";
    case "Artículo":
      return "article";
    case "Rutina":
      return "routine";
    case "Reto":
      return "challenge";
    case "Podcast":
      return "podcast";
    default:
      return "all";
  }
}

function toImageSource(
  thumb: ContentItem["thumbnail"],
): ImageSourcePropType | undefined {
  if (!thumb) return undefined;
  return typeof thumb === "string"
    ? { uri: thumb }
    : (thumb as ImageSourcePropType);
}

// ⚠️ Esto está hardcodeado. Si mañana agregas otra categoría temática,
// aquí la tienes que agregar o refactorizar para no duplicar.
// (Podcast NO va aquí porque NO es categoría.)
const CATEGORY_IDS: CategoryId[] = [
  "environment",
  "fitness",
  "routine",
  "challenges",
];

function isCategoryId(v: unknown): v is CategoryId {
  return typeof v === "string" && (CATEGORY_IDS as string[]).includes(v);
}

/** Mapea un item del API a ContentItem del frontend */
function mapApiItem(raw: any): ContentItem {
  const base = {
    id: raw._id,
    category: raw.category,
    title: raw.title,
    description: raw.description,
    thumbnail: raw.thumbnail || undefined,
    views: raw.views,
    isNew: raw.isNew,
  };
  if (raw.type === "video") {
    return { ...base, type: "video", videoUrl: raw.videoUrl || "" } as ContentItem;
  }
  return { ...base, type: "article", slides: [], body: raw.body || "" } as any;
}

export default function DiscoverScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();

  const [query, setQuery] = useState("");
  const [uiType, setUiType] = useState<UiTypeChip>("Todo");

  // ── Datos del API ──
  const [feed, setFeed] = useState<ContentItem[]>([]);
  const [featured, setFeatured] = useState<ContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // ✅ Guardados reales (persistidos) en Set para lookup rápido
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const listRef = useRef<FlatList<ContentItem>>(null);

  const normalizedQuery = query.trim();
  const isSearching = normalizedQuery.length > 0;

  const typeFilter = typeToDomain(uiType);

  // ── Cargar contenido del API ──
  const fetchContent = useCallback(async () => {
    try {
      setLoadingContent(true);
      const [feedRes, featRes] = await Promise.all([
        fetch(`${API_BASE}/content`),
        fetch(`${API_BASE}/content?featured=true`),
      ]);
      if (feedRes.ok) {
        const data = await feedRes.json();
        setFeed(data.map(mapApiItem));
      }
      if (featRes.ok) {
        const data = await featRes.json();
        setFeatured(data.map(mapApiItem));
      }
    } catch (e) {
      console.warn("Error cargando contenido:", e);
    } finally {
      setLoadingContent(false);
    }
  }, []);

  // Recargar contenido y guardados al enfocar pantalla
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      fetchContent();

      (async () => {
        if (!isAuthenticated || !user?.id) {
          if (alive) setSavedIds(new Set());
          return;
        }
        const ids = await getSavedIds(user.id);
        if (alive) setSavedIds(new Set(ids));
      })();

      return () => {
        alive = false;
      };
    }, [isAuthenticated, user?.id, fetchContent]),
  );

  const filtered = useMemo(() => {
    let base = feed;

    // Filtro por texto
    if (normalizedQuery) {
      const q = normalizedQuery.toLowerCase();
      base = base.filter((it) => it.title.toLowerCase().includes(q));
    }

    // Filtro por tipo
    if (typeFilter !== "all") {
      base = base.filter((x) => x.type === typeFilter);
    }

    return base;
  }, [feed, normalizedQuery, typeFilter]);

  // ✅ NO navegues a /content/[id] para podcast si no tienes pantalla implementada.
  // Esto evita crashes si content/[id] asume "article" (slides).
  const openDetail = useCallback(
    (item: ContentItem) => {
      if (item.type === "podcast") {
        Alert.alert(
          "Podcast",
          "La pantalla de reproducción todavía no está implementada.",
        );
        return;
      }

      // Mantén tu comportamiento actual para lo que ya existe
      router.push(`/content/${item.id}`);
    },
    [router],
  );

  const scrollTop = useCallback(() => {
    requestAnimationFrame(() =>
      listRef.current?.scrollToOffset({ offset: 0, animated: true }),
    );
  }, []);

  const onTypeChipPress = useCallback(
    (t: UiTypeChip) => {
      setUiType(t);
      scrollTop();
    },
    [scrollTop],
  );

  const toggleSave = useCallback(
    (id: string) => {
      requireAuth(async () => {
        if (!user?.id) return;

        setSavedIds((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });

        try {
          const res = await toggleSavedId(user.id, id);
          setSavedIds(new Set(res.ids));
        } catch {
          setSavedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          });
        }
      });
    },
    [requireAuth, user?.id],
  );

  const renderRow = useCallback(
    ({ item }: { item: ContentItem }) => {
      const uiTypeLabel = typeLabel(item.type);
      const isSaved = savedIds.has(item.id);
      const thumbSource = toImageSource(item.thumbnail);

      return (
        <View style={styles.rowContainer}>
          <Pressable
            style={styles.row}
            onPress={() => openDetail(item)}
            accessibilityRole="button"
            android_ripple={{ color: "rgba(255,255,255,0.06)" }}
          >
            <View style={styles.thumbWrap}>
              {!!thumbSource && (
                <Image source={thumbSource} style={styles.thumb} />
              )}
            </View>

            <View style={styles.rowBody}>
              <View style={styles.kickerRow}>
                {isCategoryId(item.category) ? (
                  <Text
                    style={[
                      styles.kickerCategory,
                      { color: getCategoryTheme(item.category).base },
                    ]}
                    numberOfLines={1}
                  >
                    {CATEGORY_LABEL[item.category].toUpperCase()}
                  </Text>
                ) : null}

                <Text style={styles.kickerDot}> • </Text>

                <Text style={styles.kickerType} numberOfLines={1}>
                  {uiTypeLabel.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.title}
              </Text>

              <Text style={styles.rowMeta} numberOfLines={1}>
                {formatViews(item.views)} vistas •{" "}
                {item.isNew ? "Nuevo" : "Reciente"}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => toggleSave(item.id)}
            style={styles.saveBtn}
            hitSlop={8}
            accessibilityRole="button"
            android_ripple={{
              color: "rgba(255,255,255,0.06)",
              borderless: true,
            }}
          >
            <MaterialIcons
              name={isSaved ? "bookmark" : "bookmark-border"}
              size={18}
              color={isSaved ? Stitch.colors.primary : "rgba(255,255,255,0.50)"}
            />
            <Text
              style={[
                styles.saveText,
                isSaved && { color: Stitch.colors.primary },
              ]}
            >
              {isSaved ? "Guardado" : "Guardar"}
            </Text>
          </Pressable>
        </View>
      );
    },
    [openDetail, savedIds, toggleSave],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.stickyHeader}>
        <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.stickyOverlay} />

        <View style={styles.headerRow}>
          <Text style={styles.h1}>Descubrir</Text>
          <Pressable
            style={styles.notifBtn}
            hitSlop={10}
            accessibilityRole="button"
          >
            <MaterialIcons
              name="notifications"
              size={20}
              color={Stitch.colors.primary}
            />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <MaterialIcons
            name="search"
            size={20}
            color="rgba(255,255,255,0.45)"
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar videos, tips, rutinas..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>

        <ScrollView
          horizontal
          style={styles.typeChipsScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {TYPE_CHIPS.map((t) => {
            const active = t === uiType;
            return (
              <Pressable
                key={t}
                onPress={() => onTypeChipPress(t)}
                style={[
                  styles.chip,
                  active ? styles.chipActive : styles.chipInactive,
                ]}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.chipText,
                    active ? styles.chipTextActive : styles.chipTextInactive,
                  ]}
                >
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList<ContentItem>
        ref={listRef}
        data={filtered}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        renderItem={renderRow}
        ListHeaderComponent={
          isSearching ? null : (
            <View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={styles.featuredRow}
              >
                {featured.map((item, idx) => {
                  const badge = badgeForFeatured(item, idx);
                  const featuredSource = toImageSource(item.thumbnail);

                  return (
                    <Pressable
                      key={item.id}
                      style={styles.featuredCard}
                      onPress={() => openDetail(item)}
                      accessibilityRole="button"
                      android_ripple={{ color: "rgba(255,255,255,0.06)" }}
                    >
                      {!!featuredSource && (
                        <Image
                          source={featuredSource}
                          style={styles.featuredImg}
                        />
                      )}

                      <LinearGradient
                        colors={[
                          "rgba(0,0,0,0)",
                          "rgba(0,0,0,0.25)",
                          "rgba(0,0,0,0.80)",
                        ]}
                        style={StyleSheet.absoluteFill}
                      />

                      <View style={styles.featuredContent}>
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>

                        <Text style={styles.featuredTitle} numberOfLines={2}>
                          {item.title}
                        </Text>

                        <Text style={styles.featuredMeta} numberOfLines={1}>
                          {item.category} • {typeLabel(item.type)} •{" "}
                          {formatViews(item.views)} vistas
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recomendado para ti</Text>
                <Text style={styles.sectionLink}>Ver todo</Text>
              </View>
            </View>
          )
        }
        ListEmptyComponent={
          isSearching ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>No encontrado</Text>
              <Text style={styles.emptySub}>
                No hay resultados para “{normalizedQuery}”.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </View>
  );
}

// ✅ estilos: mantengo los tuyos tal cual
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },
  stickyHeader: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Stitch.colors.divider,
    overflow: "hidden",
  },
  stickyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  h1: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: -0.2 },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 12, android: 10, default: 10 }),
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  searchInput: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "600" },

  chipsRow: {
    paddingTop: 10,
    paddingBottom: 6,
    gap: 10,
    alignItems: "center",
  },
  typeChipsScroll: {},

  chip: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: Stitch.colors.primary },
  chipInactive: { backgroundColor: "rgba(255,255,255,0.06)" },
  chipText: {
    fontSize: 14,
    lineHeight: 18,
    textAlignVertical: "center",
    includeFontPadding: false as any,
  },
  chipTextActive: { color: "#000", fontWeight: "800" },
  chipTextInactive: { color: "rgba(255,255,255,0.75)", fontWeight: "700" },

  listContent: { paddingBottom: 20 },

  featuredRow: { paddingHorizontal: 16, gap: 14 },
  featuredCard: {
    width: 320,
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  featuredImg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  featuredContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Stitch.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  badgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
  },
  featuredMeta: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  sectionLink: {
    color: Stitch.colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  rowContainer: { paddingHorizontal: 16 },
  row: { flexDirection: "row", gap: 14 },
  thumbWrap: {
    width: 128,
    height: 80,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  thumb: { width: "100%", height: "100%" },

  rowBody: { flex: 1, justifyContent: "center", minWidth: 0 },
  rowTitle: { color: "#fff", fontSize: 14, fontWeight: "800", marginTop: 3 },
  rowMeta: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 6,
  },

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    alignSelf: "flex-start",
    marginLeft: 142,
  },
  saveText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyWrap: { paddingHorizontal: 16, paddingTop: 26 },
  emptyTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  emptySub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  kickerRow: { flexDirection: "row", alignItems: "center" },
  kickerCategory: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  kickerDot: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 10,
    fontWeight: "900",
  },
  kickerType: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
});
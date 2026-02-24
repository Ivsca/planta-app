// app/content/[id].tsx
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";

import { API_BASE } from "@/constants/api";
import { Stitch } from "@/constants/theme";
import { getCategoryTheme } from "@/features/articles/categoryTheme";
import { CATEGORY_LABEL, type CategoryId } from "@/features/content/category";

type ApiContent = {
  _id: string;
  type: "video" | "article";
  category: string;
  title: string;
  description: string;
  thumbnail: string;
  videoSource: "youtube" | "url" | null;
  videoUrl: string | null;
  youtubeId: string | null;
  body: string;
  views: number;
  isNew: boolean;
  createdAt: string;
};

const CATEGORY_IDS = ["environment", "fitness", "routine", "challenges"];
function isCatId(v: string): v is CategoryId {
  return CATEGORY_IDS.includes(v);
}

export default function ContentViewer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const { width } = useWindowDimensions();

  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const [item, setItem] = useState<ApiContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/content/${id}`);
      if (!res.ok) throw new Error("No encontrado");
      const data: ApiContent = await res.json();
      setItem(data);
    } catch (e: any) {
      setError(e.message || "Error al cargar contenido");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={Stitch.colors.primary} />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={s.center}>
        <MaterialIcons name="error-outline" size={48} color="rgba(255,255,255,0.3)" />
        <Text style={s.errorText}>{error || "Contenido no encontrado"}</Text>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const catTheme = isCatId(item.category)
    ? getCategoryTheme(item.category)
    : { base: Stitch.colors.primary };
  const catLabel = isCatId(item.category)
    ? CATEGORY_LABEL[item.category]
    : item.category;

  const videoHeight = Math.round((width - 32) * (9 / 16));

  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.headerBtn} onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Text style={s.headerTitle} numberOfLines={1}>
          {item.type === "video" ? "Video" : "Artículo"}
        </Text>
        <View style={s.headerBtn} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══ VIDEO ═══ */}
        {item.type === "video" && item.youtubeId ? (
          <View style={[s.videoWrap, { height: videoHeight }]}>
            <WebView
              source={{
                uri: `https://www.youtube.com/embed/${item.youtubeId}?rel=0&modestbranding=1`,
              }}
              style={{ flex: 1, borderRadius: 14 }}
              allowsFullscreenVideo
              javaScriptEnabled
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        ) : item.type === "video" && item.videoUrl ? (
          <>
            {item.thumbnail ? (
              <Pressable
                style={s.videoThumbWrap}
                onPress={() => Linking.openURL(item.videoUrl!)}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={s.videoThumb}
                  resizeMode="cover"
                />
                <View style={s.playOverlay}>
                  <MaterialIcons
                    name="play-circle-filled"
                    size={56}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
              </Pressable>
            ) : null}
          </>
        ) : item.type === "article" && item.thumbnail ? (
          <Image
            source={{ uri: item.thumbnail }}
            style={s.articleImg}
            resizeMode="cover"
          />
        ) : null}

        {/* Category + type badge */}
        <View style={s.badgeRow}>
          <View style={[s.badge, { backgroundColor: `${catTheme.base}22` }]}>
            <Text style={[s.badgeText, { color: catTheme.base }]}>
              {catLabel}
            </Text>
          </View>
          <View
            style={[
              s.badge,
              {
                backgroundColor:
                  item.type === "video"
                    ? "rgba(249,115,22,0.15)"
                    : "rgba(33,196,93,0.15)",
              },
            ]}
          >
            <Text
              style={[
                s.badgeText,
                {
                  color:
                    item.type === "video" ? "#F97316" : Stitch.colors.primary,
                },
              ]}
            >
              {item.type === "video" ? "Video" : "Artículo"}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={s.title}>{item.title}</Text>

        {/* Meta */}
        <Text style={s.meta}>
          {item.views} vistas • {item.isNew ? "Nuevo" : "Publicado"}
        </Text>

        {/* Description */}
        {item.description ? (
          <Text style={s.description}>{item.description}</Text>
        ) : null}

        {/* Article body */}
        {item.type === "article" && item.body ? (
          <Text style={s.body}>{item.body}</Text>
        ) : null}

        {/* Open external for URL videos */}
        {item.type === "video" && item.videoUrl && !item.youtubeId ? (
          <Pressable
            style={s.openBtn}
            onPress={() => Linking.openURL(item.videoUrl!)}
          >
            <MaterialIcons name="open-in-new" size={18} color="#000" />
            <Text style={s.openBtnText}>Abrir video</Text>
          </Pressable>
        ) : null}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },
  center: {
    flex: 1,
    backgroundColor: Stitch.colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
  },
  errorText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  backBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  backBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
  },

  content: { padding: 16 },

  videoWrap: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#111",
    marginBottom: 16,
  },
  videoThumbWrap: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#111",
  },
  videoThumb: { width: "100%" as any, aspectRatio: 16 / 9 },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  articleImg: {
    width: "100%" as any,
    height: 200,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 30,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  meta: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 16,
  },
  description: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 16,
  },
  body: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 26,
    marginTop: 8,
  },

  openBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Stitch.colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 16,
  },
  openBtnText: { color: "#000", fontWeight: "900", fontSize: 14 },
});

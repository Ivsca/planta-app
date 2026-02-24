// app/admin/content/index.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { API_BASE } from "../../../constants/api";
import { Stitch } from "../../../constants/theme";
import { useAuth } from "../../../context/AuthContext";

// ── Types ────────────────────────────────────────────
type ContentType = "video" | "article";
type Category = "environment" | "fitness" | "routine" | "challenges";
type VideoSource = "youtube" | "url";

type ContentItem = {
  _id: string;
  type: ContentType;
  category: Category;
  title: string;
  description: string;
  thumbnail: string;
  videoSource: VideoSource | null;
  videoUrl: string | null;
  youtubeId: string | null;
  body: string;
  views: number;
  isNew: boolean;
  isFeatured: boolean;
  status: "draft" | "published" | "archived";
  createdAt: string;
};

// ── Constants ────────────────────────────────────────
const CATEGORIES: { id: Category; label: string }[] = [
  { id: "environment", label: "Educación ambiental" },
  { id: "fitness", label: "Actividad física" },
  { id: "routine", label: "Rutina" },
  { id: "challenges", label: "Retos" },
];

const EMPTY_FORM = {
  type: "video" as ContentType,
  category: "environment" as Category,
  title: "",
  description: "",
  thumbnail: "",
  videoSource: "youtube" as VideoSource,
  videoUrl: "",
  youtubeInput: "",
  body: "",
  isFeatured: false,
  status: "published" as "draft" | "published",
};

// ── YouTube helper ────────────────────────────────────
function extractYoutubeId(input: string): string | null {
  if (!input) return null;
  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  const url = iframeMatch ? iframeMatch[1] : input.trim();
  let m: RegExpMatchArray | null;

  m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  return null;
}

// ══════════════════════════════════════════════════════
// SCREEN
// ══════════════════════════════════════════════════════
export default function AdminContent() {
  const { token } = useAuth();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ContentType>("all");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [ytPreview, setYtPreview] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/content/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar contenido");
      const data = await res.json();
      setItems(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.type === filter);

  // ── CRUD helpers ──────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setYtPreview(null);
    setModalVisible(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditingId(item._id);
    setForm({
      type: item.type,
      category: item.category,
      title: item.title,
      description: item.description || "",
      thumbnail: item.thumbnail || "",
      videoSource: (item.videoSource as VideoSource) || "youtube",
      videoUrl: item.videoUrl || "",
      youtubeInput: item.youtubeId
        ? `https://www.youtube.com/watch?v=${item.youtubeId}`
        : "",
      body: item.body || "",
      isFeatured: item.isFeatured,
      status: item.status === "draft" ? "draft" : "published",
    });
    setYtPreview(
      item.youtubeId
        ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
        : null
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_BASE}/content/${editingId}`
        : `${API_BASE}/content`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar");
      }

      setModalVisible(false);
      fetchContent();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: ContentItem) => {
    Alert.alert("Eliminar", `¿Eliminar "${item.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_BASE}/content/${item._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al eliminar");
            fetchContent();
          } catch (err: any) {
            Alert.alert("Error", err.message);
          }
        },
      },
    ]);
  };

  // ── YouTube preview ───────────────────────────────
  const onYoutubeInputChange = (text: string) => {
    setForm((f) => ({ ...f, youtubeInput: text }));
    const ytId = extractYoutubeId(text);
    if (ytId) {
      setYtPreview(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      if (!form.thumbnail) {
        setForm((f) => ({
          ...f,
          youtubeInput: text,
          thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        }));
      }
    } else {
      setYtPreview(null);
    }
  };

  // ── Render list item ──────────────────────────────
  const renderItem = ({ item }: { item: ContentItem }) => (
    <View style={st.card}>
      <View style={st.cardRow}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={st.cardThumb} />
        ) : (
          <View style={[st.cardThumb, st.cardThumbEmpty]}>
            <MaterialIcons
              name={
                item.type === "video" ? "play-circle-outline" : "article"
              }
              size={24}
              color="rgba(255,255,255,0.3)"
            />
          </View>
        )}

        <View style={st.cardBody}>
          <View style={st.cardBadges}>
            <View
              style={[
                st.badge,
                {
                  backgroundColor:
                    item.type === "video"
                      ? "rgba(249,115,22,0.2)"
                      : "rgba(33,196,93,0.2)",
                },
              ]}
            >
              <Text
                style={[
                  st.badgeText,
                  {
                    color:
                      item.type === "video"
                        ? "#F97316"
                        : Stitch.colors.primary,
                  },
                ]}
              >
                {item.type === "video" ? "Video" : "Artículo"}
              </Text>
            </View>
            {item.isFeatured && (
              <View
                style={[
                  st.badge,
                  { backgroundColor: "rgba(96,165,250,0.2)" },
                ]}
              >
                <Text style={[st.badgeText, { color: "#60A5FA" }]}>
                  Destacado
                </Text>
              </View>
            )}
            {item.status === "draft" && (
              <View
                style={[
                  st.badge,
                  { backgroundColor: "rgba(255,255,255,0.1)" },
                ]}
              >
                <Text
                  style={[
                    st.badgeText,
                    { color: "rgba(255,255,255,0.5)" },
                  ]}
                >
                  Borrador
                </Text>
              </View>
            )}
          </View>
          <Text style={st.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={st.cardMeta} numberOfLines={1}>
            {CATEGORIES.find((c) => c.id === item.category)?.label} •{" "}
            {item.views} vistas
          </Text>
        </View>
      </View>

      <View style={st.cardActions}>
        <Pressable style={st.actionBtn} onPress={() => openEdit(item)}>
          <MaterialIcons name="edit" size={18} color={Stitch.colors.primary} />
        </Pressable>
        <Pressable style={st.actionBtn} onPress={() => handleDelete(item)}>
          <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
        </Pressable>
      </View>
    </View>
  );

  // ── Screen ────────────────────────────────────────
  return (
    <View style={st.screen}>
      {/* Header */}
      <View style={st.header}>
        <Text style={st.headerTitle}>Contenido</Text>
        <Pressable style={st.addBtn} onPress={openCreate}>
          <MaterialIcons name="add" size={20} color="#000" />
          <Text style={st.addBtnText}>Nuevo</Text>
        </Pressable>
      </View>

      {/* Filter chips */}
      <View style={st.chips}>
        {(["all", "video", "article"] as const).map((f) => {
          const active = filter === f;
          const label =
            f === "all" ? "Todo" : f === "video" ? "Videos" : "Artículos";
          return (
            <Pressable
              key={f}
              style={[st.chip, active && st.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[st.chipText, active && st.chipTextActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* List */}
      {loading ? (
        <View style={st.center}>
          <ActivityIndicator size="large" color={Stitch.colors.primary} />
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={st.center}>
          <MaterialIcons
            name="inbox"
            size={48}
            color="rgba(255,255,255,0.2)"
          />
          <Text style={st.emptyText}>No hay contenido</Text>
          <Text style={st.emptyHint}>
            Toca "Nuevo" para agregar videos o artículos
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          contentContainerStyle={st.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

      {/* ═══════════ Create / Edit Modal ═══════════ */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={st.modalScreen}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Modal header */}
          <View style={st.modalHeader}>
            <Pressable onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </Pressable>
            <Text style={st.modalTitle}>
              {editingId ? "Editar contenido" : "Nuevo contenido"}
            </Text>
            <Pressable
              style={[st.saveBtn, saving && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={st.saveBtnText}>Guardar</Text>
              )}
            </Pressable>
          </View>

          <ScrollView
            style={st.modalScroll}
            contentContainerStyle={st.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Type selector ── */}
            <Text style={st.label}>Tipo</Text>
            <View style={st.segmented}>
              {(["video", "article"] as ContentType[]).map((t) => (
                <Pressable
                  key={t}
                  style={[st.seg, form.type === t && st.segActive]}
                  onPress={() => setForm((f) => ({ ...f, type: t }))}
                >
                  <MaterialIcons
                    name={t === "video" ? "videocam" : "article"}
                    size={16}
                    color={
                      form.type === t ? "#000" : "rgba(255,255,255,0.6)"
                    }
                  />
                  <Text
                    style={[
                      st.segText,
                      form.type === t && st.segTextActive,
                    ]}
                  >
                    {t === "video" ? "Video" : "Artículo"}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* ── Title ── */}
            <Text style={st.label}>Título *</Text>
            <TextInput
              style={st.input}
              value={form.title}
              onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
              placeholder="Título del contenido"
              placeholderTextColor="rgba(255,255,255,0.3)"
            />

            {/* ── Description ── */}
            <Text style={st.label}>Descripción</Text>
            <TextInput
              style={[st.input, { minHeight: 70 }]}
              value={form.description}
              onChangeText={(t) =>
                setForm((f) => ({ ...f, description: t }))
              }
              placeholder="Breve descripción del contenido"
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
            />

            {/* ── Category ── */}
            <Text style={st.label}>Categoría</Text>
            <View style={st.catRow}>
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c.id}
                  style={[
                    st.catChip,
                    form.category === c.id && st.catChipActive,
                  ]}
                  onPress={() =>
                    setForm((f) => ({ ...f, category: c.id }))
                  }
                >
                  <Text
                    style={[
                      st.catChipText,
                      form.category === c.id && st.catChipTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* ── Thumbnail ── */}
            <Text style={st.label}>Thumbnail URL</Text>
            <TextInput
              style={st.input}
              value={form.thumbnail}
              onChangeText={(t) =>
                setForm((f) => ({ ...f, thumbnail: t }))
              }
              placeholder="https://ejemplo.com/imagen.jpg"
              placeholderTextColor="rgba(255,255,255,0.3)"
              autoCapitalize="none"
            />
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail }}
                style={st.thumbPreview}
                resizeMode="cover"
              />
            ) : null}

            {/* ═══════════ VIDEO FIELDS ═══════════ */}
            {form.type === "video" && (
              <>
                <Text style={st.label}>Fuente del video</Text>
                <View style={st.segmented}>
                  {(["youtube", "url"] as VideoSource[]).map((vs) => (
                    <Pressable
                      key={vs}
                      style={[
                        st.seg,
                        form.videoSource === vs && st.segActive,
                      ]}
                      onPress={() =>
                        setForm((f) => ({ ...f, videoSource: vs }))
                      }
                    >
                      <MaterialIcons
                        name={vs === "youtube" ? "smart-display" : "link"}
                        size={16}
                        color={
                          form.videoSource === vs
                            ? "#000"
                            : "rgba(255,255,255,0.6)"
                        }
                      />
                      <Text
                        style={[
                          st.segText,
                          form.videoSource === vs && st.segTextActive,
                        ]}
                      >
                        {vs === "youtube" ? "YouTube" : "URL directa"}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {form.videoSource === "youtube" ? (
                  <>
                    <Text style={st.label}>Link de YouTube</Text>
                    <Text style={st.hint}>
                      Pega una URL, iframe embed o ID de YouTube
                    </Text>
                    <TextInput
                      style={[st.input, { minHeight: 80 }]}
                      value={form.youtubeInput}
                      onChangeText={onYoutubeInputChange}
                      placeholder={'https://www.youtube.com/watch?v=... o <iframe ...>'}
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      multiline
                      autoCapitalize="none"
                    />
                    {ytPreview && (
                      <View style={st.ytPreview}>
                        <Image
                          source={{ uri: ytPreview }}
                          style={st.ytImg}
                          resizeMode="cover"
                        />
                        <View style={st.ytPlayOverlay}>
                          <MaterialIcons
                            name="play-circle-filled"
                            size={44}
                            color="rgba(255,255,255,0.85)"
                          />
                        </View>
                        <Text style={st.ytOk}>✓ Video detectado</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={st.label}>URL del video</Text>
                    <TextInput
                      style={st.input}
                      value={form.videoUrl}
                      onChangeText={(t) =>
                        setForm((f) => ({ ...f, videoUrl: t }))
                      }
                      placeholder="https://ejemplo.com/video.mp4"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      autoCapitalize="none"
                    />
                  </>
                )}
              </>
            )}

            {/* ═══════════ ARTICLE FIELDS ═══════════ */}
            {form.type === "article" && (
              <>
                <Text style={st.label}>Contenido del artículo</Text>
                <TextInput
                  style={[st.input, { minHeight: 200 }]}
                  value={form.body}
                  onChangeText={(t) =>
                    setForm((f) => ({ ...f, body: t }))
                  }
                  placeholder="Escribe el contenido del artículo aquí..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  multiline
                  textAlignVertical="top"
                />
              </>
            )}

            {/* ── Featured toggle ── */}
            <View style={st.toggleRow}>
              <View>
                <Text style={st.toggleLabel}>Destacado</Text>
                <Text style={st.toggleHint}>
                  Aparecerá en el carrusel principal
                </Text>
              </View>
              <Switch
                value={form.isFeatured}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, isFeatured: v }))
                }
                trackColor={{
                  false: "rgba(255,255,255,0.1)",
                  true: "rgba(33,196,93,0.4)",
                }}
                thumbColor={
                  form.isFeatured ? Stitch.colors.primary : "#666"
                }
              />
            </View>

            {/* ── Status ── */}
            <Text style={st.label}>Estado</Text>
            <View style={st.segmented}>
              {(["published", "draft"] as const).map((s) => (
                <Pressable
                  key={s}
                  style={[st.seg, form.status === s && st.segActive]}
                  onPress={() => setForm((f) => ({ ...f, status: s }))}
                >
                  <Text
                    style={[
                      st.segText,
                      form.status === s && st.segTextActive,
                    ]}
                  >
                    {s === "published" ? "Publicado" : "Borrador"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={{ height: 50 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────
const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "900" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Stitch.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  addBtnText: { color: "#000", fontWeight: "900", fontSize: 13 },

  chips: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  chipActive: { backgroundColor: Stitch.colors.primary },
  chipText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
    fontSize: 13,
  },
  chipTextActive: { color: "#000", fontWeight: "800" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  emptyHint: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 32,
  },

  list: { paddingHorizontal: 16, paddingBottom: 24 },

  card: {
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 12,
  },
  cardRow: { flexDirection: "row", gap: 12 },
  cardThumb: { width: 80, height: 56, borderRadius: 10 },
  cardThumbEmpty: {
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1, justifyContent: "center" },
  cardBadges: { flexDirection: "row", gap: 6, marginBottom: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: { color: "#fff", fontSize: 14, fontWeight: "800" },
  cardMeta: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingTop: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Modal ──
  modalScreen: { flex: 1, backgroundColor: Stitch.colors.bg },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 16 : 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  modalTitle: { color: "#fff", fontSize: 17, fontWeight: "900" },
  saveBtn: {
    backgroundColor: Stitch.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  saveBtnText: { color: "#000", fontWeight: "900", fontSize: 13 },

  modalScroll: { flex: 1 },
  modalContent: { padding: 16, gap: 4 },

  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 6,
  },
  hint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  segmented: { flexDirection: "row", gap: 8 },
  seg: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  segActive: { backgroundColor: Stitch.colors.primary },
  segText: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "700",
    fontSize: 13,
  },
  segTextActive: { color: "#000", fontWeight: "800" },

  catRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  catChipActive: {
    backgroundColor: "rgba(33,196,93,0.15)",
    borderColor: Stitch.colors.primary,
  },
  catChipText: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "700",
    fontSize: 12,
  },
  catChipTextActive: { color: Stitch.colors.primary, fontWeight: "800" },

  thumbPreview: {
    width: "100%" as any,
    height: 140,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  ytPreview: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  ytImg: { width: "100%" as any, height: 180 },
  ytPlayOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  ytOk: {
    position: "absolute",
    bottom: 8,
    left: 10,
    color: Stitch.colors.primary,
    fontWeight: "900",
    fontSize: 12,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  toggleLabel: { color: "#fff", fontWeight: "800", fontSize: 14 },
  toggleHint: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});

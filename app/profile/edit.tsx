import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stitch } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

// Debe apuntar al MISMO avatarStorage que usa Profile
import { getAvatarUri, setAvatarUri as persistAvatarUri } from "./avatarStorage";

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Avatar
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarDirty, setAvatarDirty] = useState(false); // ✅ NUEVO

  // ✅ Hooks siempre arriba (NO condicionales)
  useEffect(() => {
    (async () => {
      try {
        if (!user?.id) return;
        const saved = await getAvatarUri(user.id);
        setAvatarUri(saved);
      } catch {
        setAvatarUri(null);
      }
    })();
  }, [user?.id]);

  // Si no está autenticado, no debería estar aquí
  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <View style={styles.centered}>
          <MaterialIcons name="lock" size={48} color="rgba(255,255,255,0.3)" />
          <Text style={styles.noAuthText}>
            Debes iniciar sesión para editar tu perfil
          </Text>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const pickAvatar = async () => {
    if (!user?.id) return;

    setAvatarLoading(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos permiso para acceder a tu galería.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled) return;

      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert("Error", "No se pudo leer la imagen seleccionada.");
        return;
      }

      // UI + persistencia inmediata
      setAvatarUri(uri);
      setAvatarDirty(true); // ✅ marca cambio de foto
      await persistAvatarUri(user.id, uri);
    } catch {
      Alert.alert("Error", "No se pudo abrir la galería.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");

    const nextName = name.trim();
    const nameChanged = !!nextName && nextName !== user.name;

    // ✅ Si no cambió nombre ni foto
    if (!nameChanged && !avatarDirty) {
      Alert.alert("Sin cambios", "No hay cambios que guardar");
      return;
    }

    // ✅ Si SOLO cambió la foto, no hay que llamar backend
    if (!nameChanged && avatarDirty) {
      Alert.alert("Listo", "Foto actualizada correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
      return;
    }

    // ✅ Si cambió el nombre (y quizá también la foto)
    setSaving(true);
    const result = await updateProfile({ name: nextName });
    setSaving(false);

    if (result.ok) {
      Alert.alert("Listo", "Perfil actualizado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      setError(result.error || "Error al actualizar");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <MaterialIcons
                name="arrow-back"
                size={22}
                color="rgba(255,255,255,0.6)"
              />
            </Pressable>
            <Text style={styles.headerTitle}>Editar perfil</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Foto de perfil */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarRing}>
                <View style={styles.avatarMask}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                  ) : (
                    <MaterialIcons
                      name="person"
                      size={54}
                      color="rgba(255,255,255,0.35)"
                    />
                  )}
                </View>
              </View>

              <Pressable
                style={[styles.photoBtn, avatarLoading && { opacity: 0.7 }]}
                onPress={pickAvatar}
                disabled={avatarLoading}
              >
                {avatarLoading ? (
                  <ActivityIndicator color={Stitch.colors.primary} />
                ) : (
                  <>
                    <MaterialIcons
                      name="photo-camera"
                      size={16}
                      color={Stitch.colors.primary}
                    />
                    <Text style={styles.photoBtnText}>Cambiar foto</Text>
                  </>
                )}
              </Pressable>
            </View>

            {/* Nombre */}
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons
                name="person"
                size={20}
                color="rgba(255,255,255,0.35)"
              />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor="rgba(255,255,255,0.25)"
                autoCapitalize="words"
              />
            </View>

            {/* Correo (no editable) */}
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={[styles.inputWrap, { opacity: 0.5 }]}>
              <MaterialIcons
                name="email"
                size={20}
                color="rgba(255,255,255,0.35)"
              />
              <Text style={styles.disabledText}>{user.email}</Text>
              <MaterialIcons
                name="lock"
                size={14}
                color="rgba(255,255,255,0.25)"
              />
            </View>

            {/* Error */}
            {!!error && (
              <View style={styles.errorRow}>
                <MaterialIcons name="error-outline" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Botones */}
            <View style={styles.btns}>
              <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, (saving || avatarLoading) && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving || avatarLoading}
              >
                {saving ? (
                  <ActivityIndicator color={Stitch.colors.bg} size="small" />
                ) : (
                  <Text style={styles.saveText}>Guardar</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  noAuthText: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Stitch.colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },

  body: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },

  avatarSection: { alignItems: "center", marginBottom: 8 },
  avatarRing: {
    width: 116,
    height: 116,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: "rgba(33,196,93,0.20)",
    padding: 4,
  },
  avatarMask: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  avatarImg: { width: "100%", height: "100%", resizeMode: "cover" },

  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.20)",
  },
  photoBtnText: {
    color: Stitch.colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  label: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  input: { flex: 1, color: "#fff", fontSize: 15, fontWeight: "600" },
  disabledText: {
    flex: 1,
    color: "rgba(255,255,255,0.45)",
    fontSize: 15,
    fontWeight: "600",
  },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 4,
  },
  errorText: { color: "#EF4444", fontSize: 12, fontWeight: "700" },

  btns: { flexDirection: "row", gap: 12, marginTop: 28 },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cancelText: { color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: "800" },
  saveBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: Stitch.colors.primary,
  },
  saveText: { color: Stitch.colors.bg, fontSize: 14, fontWeight: "900" },

  primaryBtn: {
    backgroundColor: Stitch.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: Stitch.colors.bg, fontSize: 15, fontWeight: "900" },
});

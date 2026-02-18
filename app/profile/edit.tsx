import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
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

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si no está autenticado, no debería estar aquí
  if (!isAuthenticated || !user) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <View style={styles.centered}>
          <MaterialIcons name="lock" size={48} color="rgba(255,255,255,0.3)" />
          <Text style={styles.noAuthText}>Debes iniciar sesión para editar tu perfil</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const handleSave = async () => {
    setError("");

    const data: { name?: string; password?: string } = {};

    if (name.trim() && name.trim() !== user.name) {
      data.name = name.trim();
    }
    if (password) {
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      data.password = password;
    }

    if (Object.keys(data).length === 0) {
      Alert.alert("Sin cambios", "No hay cambios que guardar");
      return;
    }

    setLoading(true);
    const result = await updateProfile(data);
    setLoading(false);

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
              <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.6)" />
            </Pressable>
            <Text style={styles.headerTitle}>Editar perfil</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Nombre */}
            <Text style={styles.label}>Nombre</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="person" size={20} color="rgba(255,255,255,0.35)" />
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
              <MaterialIcons name="email" size={20} color="rgba(255,255,255,0.35)" />
              <Text style={styles.disabledText}>{user.email}</Text>
              <MaterialIcons name="lock" size={14} color="rgba(255,255,255,0.25)" />
            </View>

            {/* Nueva contraseña */}
            <Text style={styles.label}>Nueva contraseña (opcional)</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock" size={20} color="rgba(255,255,255,0.35)" />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Dejar vacío para no cambiar"
                placeholderTextColor="rgba(255,255,255,0.25)"
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword((p) => !p)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color="rgba(255,255,255,0.35)"
                />
              </Pressable>
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
                style={[styles.saveBtn, loading && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
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
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
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
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
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
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },

  btns: {
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
  },
  cancelBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cancelText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    fontWeight: "800",
  },
  saveBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 999,
    backgroundColor: Stitch.colors.primary,
  },
  saveText: {
    color: Stitch.colors.bg,
    fontSize: 14,
    fontWeight: "900",
  },
  primaryBtn: {
    backgroundColor: Stitch.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: Stitch.colors.bg,
    fontSize: 15,
    fontWeight: "900",
  },
});

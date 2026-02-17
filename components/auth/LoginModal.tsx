import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Stitch } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
};

export function LoginModal({ visible, onDismiss, onSuccess }: Props) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setLoading(false);
  };

  const handleSubmit = async () => {
    setError("");

    if (mode === "register" && !name.trim()) {
      setError("Ingresa tu nombre");
      return;
    }
    if (!email.trim()) {
      setError("Ingresa tu correo");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const result =
      mode === "login"
        ? await login(email.trim().toLowerCase(), password)
        : await register(name.trim(), email.trim().toLowerCase(), password);

    setLoading(false);

    if (result.ok) {
      reset();
      onSuccess();
    } else {
      setError(result.error || "Error desconocido");
    }
  };

  const handleDismiss = () => {
    reset();
    setMode("login");
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleDismiss}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          {Platform.OS !== "web" && (
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          )}
          <View style={styles.overlayTint} />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <View style={styles.card}>
              {/* Botón cerrar */}
              <Pressable style={styles.closeBtn} onPress={handleDismiss}>
                <MaterialIcons name="close" size={22} color="rgba(255,255,255,0.5)" />
              </Pressable>

              {/* Header */}
              <View style={styles.lockIcon}>
                <MaterialIcons name="eco" size={32} color={Stitch.colors.primary} />
              </View>
              <Text style={styles.title}>
                {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
              </Text>
              <Text style={styles.subtitle}>
                {mode === "login"
                  ? "Ingresa para acceder al contenido completo"
                  : "Regístrate para comenzar tu transformación"}
              </Text>

              {/* Campos */}
              {mode === "register" && (
                <View style={styles.inputWrap}>
                  <MaterialIcons name="person" size={20} color="rgba(255,255,255,0.35)" />
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputWrap}>
                <MaterialIcons name="email" size={20} color="rgba(255,255,255,0.35)" />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="rgba(255,255,255,0.30)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputWrap}>
                <MaterialIcons name="lock" size={20} color="rgba(255,255,255,0.35)" />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="rgba(255,255,255,0.30)"
                  value={password}
                  onChangeText={setPassword}
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

              {/* Botón principal */}
              <Pressable
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Stitch.colors.bg} />
                ) : (
                  <Text style={styles.primaryBtnText}>
                    {mode === "login" ? "Iniciar sesión" : "Registrarse"}
                  </Text>
                )}
              </Pressable>

              {/* Toggle login/register */}
              <Pressable
                style={styles.toggleRow}
                onPress={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                }}
              >
                <Text style={styles.toggleText}>
                  {mode === "login"
                    ? "¿No tienes cuenta? "
                    : "¿Ya tienes cuenta? "}
                </Text>
                <Text style={styles.toggleLink}>
                  {mode === "login" ? "Regístrate" : "Inicia sesión"}
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlayTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.60)",
  },
  keyboardView: {
    justifyContent: "flex-end",
  },
  card: {
    backgroundColor: "#111111",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: "rgba(33,196,93,0.15)",
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 4,
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.12)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.20)",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
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
    marginBottom: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },
  primaryBtn: {
    backgroundColor: Stitch.colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryBtnText: {
    color: Stitch.colors.bg,
    fontSize: 15,
    fontWeight: "900",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  toggleText: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 13,
    fontWeight: "600",
  },
  toggleLink: {
    color: Stitch.colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
});

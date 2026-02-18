import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stitch } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) {
      setError("Ingresa tu correo");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (result.ok) {
      router.replace("/(tabs)");
    } else {
      setError(result.error || "Error al iniciar sesión");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          {/* Botón volver */}
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.6)" />
          </Pressable>

          <View style={styles.body}>
            {/* Icono */}
            <View style={styles.lockIcon}>
              <MaterialIcons name="eco" size={36} color={Stitch.colors.primary} />
            </View>

            <Text style={styles.title}>Inicia sesión</Text>
            <Text style={styles.subtitle}>
              Ingresa para acceder al contenido completo
            </Text>

            {/* Correo */}
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

            {/* Contraseña */}
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
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Stitch.colors.bg} />
              ) : (
                <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
              )}
            </Pressable>

            {/* Ir a registro */}
            <Pressable
              style={styles.toggleRow}
              onPress={() => router.replace("/(auth)/register")}
            >
              <Text style={styles.toggleText}>¿No tienes cuenta? </Text>
              <Text style={styles.toggleLink}>Regístrate</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },
  flex: { flex: 1 },
  backBtn: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  lockIcon: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.12)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.20)",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
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
    marginTop: 20,
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

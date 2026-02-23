import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Stitch } from "../../constants/theme";
import { GlassCard } from "../../components/ui/GlassCard";
import { useAuth } from "../../context/AuthContext";
import { useRequireAuth } from "../../hooks/use-require-auth";
import { LoginModal } from "../../components/auth/LoginModal";

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { isAuthenticated, updateProfile, deleteAccount } = useAuth();
  const { requireAuth, loginModalVisible, dismissLogin, onLoginSuccess } =
    useRequireAuth();

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return pwd.length >= 6 && pwd === pwd2;
  }, [pwd, pwd2]);

  const submit = () => {
    requireAuth(async () => {
      if (pwd.length < 6) {
        Alert.alert("Contraseña inválida", "Debe tener al menos 6 caracteres.");
        return;
      }
      if (pwd !== pwd2) {
        Alert.alert("No coincide", "Las contraseñas no coinciden.");
        return;
      }

      setSaving(true);
      const result = await updateProfile({ password: pwd });
      setSaving(false);

      if (result.ok) {
        setPwd("");
        setPwd2("");
        Alert.alert("Listo", "Tu contraseña se actualizó correctamente.");
      } else {
        Alert.alert("Error", result.error || "No se pudo actualizar la contraseña.");
      }
    });
  };

  const confirmDelete = () => {
    requireAuth(() => {
      Alert.alert(
        "Eliminar cuenta",
        "¿Estás seguro? Esta acción no se puede deshacer.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              setSaving(true);
              const result = await deleteAccount();
              setSaving(false);
              if (!result.ok) {
                Alert.alert("Error", result.error || "No se pudo eliminar la cuenta");
              }
            },
          },
        ],
      );
    });
  };

  return (
    <View style={styles.screen}>
      <LoginModal
        visible={loginModalVisible}
        onDismiss={dismissLogin}
        onSuccess={onLoginSuccess}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.h1}>Seguridad y privacidad</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cambiar contraseña */}
        <Text style={styles.sectionLabel}>Seguridad</Text>
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Cambiar contraseña</Text>
          <Text style={styles.cardSub}>
            Usa una contraseña de al menos 6 caracteres. Ideal: 10+ y única.
          </Text>

          <View style={styles.inputWrap}>
            <MaterialIcons name="lock" size={18} color="rgba(255,255,255,0.35)" />
            <TextInput
              style={styles.input}
              value={pwd}
              onChangeText={setPwd}
              placeholder="Nueva contraseña"
              placeholderTextColor="rgba(255,255,255,0.25)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={[styles.inputWrap, { marginTop: 10 }]}>
            <MaterialIcons name="lock" size={18} color="rgba(255,255,255,0.35)" />
            <TextInput
              style={styles.input}
              value={pwd2}
              onChangeText={setPwd2}
              placeholder="Confirmar contraseña"
              placeholderTextColor="rgba(255,255,255,0.25)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Pressable
            style={[styles.primaryBtn, !canSubmit && { opacity: 0.5 }]}
            onPress={submit}
            disabled={!canSubmit || saving}
          >
            {saving ? (
              <ActivityIndicator color={Stitch.colors.bg} />
            ) : (
              <Text style={styles.primaryBtnText}>Guardar cambios</Text>
            )}
          </Pressable>
        </GlassCard>

        {/* Política */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Privacidad</Text>
        <GlassCard style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() => router.push("/settings/privacy-policy")}
          >
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <MaterialIcons name="description" size={20} color={Stitch.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Política de privacidad</Text>
                <Text style={styles.rowSub}>Cómo usamos y protegemos tus datos</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.30)" />
          </Pressable>
        </GlassCard>

        {/* Eliminar cuenta */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Peligro</Text>
        <GlassCard style={styles.card}>
          <Pressable style={styles.dangerRow} onPress={confirmDelete} disabled={saving}>
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, styles.dangerIcon]}>
                <MaterialIcons name="delete-forever" size={20} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.dangerTitle}>Eliminar cuenta</Text>
                <Text style={styles.rowSub}>Borra tu cuenta y datos permanentemente</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.30)" />
          </Pressable>
        </GlassCard>

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
  h1: { flex: 1, color: "#fff", fontSize: 18, fontWeight: "900" },

  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 24 },

  sectionLabel: {
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 6,
    color: "rgba(33,196,93,0.40)",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },

  card: { borderRadius: 18, overflow: "hidden", padding: 14 },

  cardTitle: { color: "#fff", fontSize: 14, fontWeight: "900" },
  cardSub: { color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: "600", marginTop: 6 },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 12,
  },
  input: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "600" },

  primaryBtn: {
    marginTop: 14,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Stitch.colors.primary,
  },
  primaryBtnText: { color: Stitch.colors.bg, fontSize: 13, fontWeight: "900" },

  row: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dangerRow: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(33,196,93,0.10)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.12)",
  },
  dangerIcon: {
    backgroundColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.20)",
  },
  rowTitle: { color: "#fff", fontSize: 14, fontWeight: "800" },
  dangerTitle: { color: "#EF4444", fontSize: 14, fontWeight: "900" },
  rowSub: { color: "rgba(255,255,255,0.50)", fontSize: 12, fontWeight: "600", marginTop: 2 },
});

import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import * as Clipboard from "expo-clipboard";

import { Stitch } from "../../constants/theme";
import { GlassCard } from "../../components/ui/GlassCard";
import { useAuth } from "../../context/AuthContext";

const SUPPORT_EMAIL = "Laplantadetransformacion@gmail.com"; 
const SUPPORT_WHATSAPP = "573187767326";

type FaqItem = { q: string; a: string };

const FAQ: FaqItem[] = [
  {
    q: "¿Cómo cambio mi foto de perfil?",
    a: "Ve a Perfil → Editar perfil → Cambiar foto. Luego Guardar. Si no se ve de inmediato, vuelve atrás y entra otra vez.",
  },
  {
    q: "¿Cómo cambio mi contraseña?",
    a: "Ve a Perfil → Seguridad y privacidad → Cambiar contraseña. Por seguridad, no se cambia desde Editar perfil.",
  },
  {
    q: "No puedo iniciar sesión, ¿qué hago?",
    a: "Verifica tu correo/contraseña. Si sigue fallando, revisa tu conexión y vuelve a intentar. Si persiste, usa “Reportar problema” y envíanos el diagnóstico.",
  },
  {
    q: "¿Dónde se guardan mis cambios?",
    a: "Nombre/cuenta se guardan en el servidor. La foto se guarda localmente (MVP) por usuario, por eso puede depender del dispositivo.",
  },
];

function safeString(v: unknown) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export default function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated, token } = useAuth();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const diagnostics = useMemo(() => {
    const expoConfig = (Constants as any).expoConfig ?? (Constants as any).manifest ?? {};
    const appName = safeString(expoConfig?.name || "Planta");
    const version = safeString(expoConfig?.version || "unknown");
    const runtimeVersion = safeString((expoConfig as any)?.runtimeVersion || "unknown");
    const extra = (expoConfig as any)?.extra || {};

    const uid = isAuthenticated ? user?.id : undefined;
    const email = isAuthenticated ? user?.email : undefined;

    // No metas el token completo en diagnósticos (seguridad)
    const tokenHint = token ? `${token.slice(0, 12)}…` : "null";

    return [
      `App: ${appName}`,
      `Version: ${version}`,
      `Runtime: ${runtimeVersion}`,
      `Platform: ${Platform.OS}`,
      `PlatformVersion: ${safeString(Platform.Version)}`,
      `API_BASE: ${safeString(extra?.API_BASE) || "n/a"}`,
      `UserId: ${safeString(uid) || "anon"}`,
      `Email: ${safeString(email) || "anon"}`,
      `Token: ${tokenHint}`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n");
  }, [isAuthenticated, user?.id, user?.email, token]);

  const openWhatsApp = async () => {
    if (SUPPORT_WHATSAPP.includes("X")) {
      Alert.alert("Falta configurar", "Define SUPPORT_WHATSAPP en settings/help.tsx");
      return;
    }

    const text = encodeURIComponent(
      `Hola, necesito ayuda.\n\nDiagnóstico:\n${diagnostics}`,
    );
    const url = `https://wa.me/${SUPPORT_WHATSAPP}?text=${text}`;

    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert("No se pudo abrir WhatsApp", "Revisa si WhatsApp está instalado.");
      return;
    }
    Linking.openURL(url);
  };

  const reportByEmail = async () => {
    if (SUPPORT_EMAIL.includes("soporte@plantaapp.com")) {
      Alert.alert("Falta configurar", "Define SUPPORT_EMAIL en settings/help.tsx");
      return;
    }

    const subject = encodeURIComponent("Soporte Planta - Reporte de problema");
    const body = encodeURIComponent(
      `Describe el problema (pasos + qué esperabas + qué pasó):\n\n---\nDiagnóstico:\n${diagnostics}\n`,
    );

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    const can = await Linking.canOpenURL(mailto);
    if (!can) {
      Alert.alert("No se pudo abrir el correo", "Configura una app de correo en el dispositivo.");
      return;
    }
    Linking.openURL(mailto);
  };

  const copyDiagnostics = async () => {
    try {
      await Clipboard.setStringAsync(diagnostics);
      Alert.alert("Copiado", "Diagnóstico copiado al portapapeles.");
    } catch {
      Alert.alert(
        "No se pudo copiar",
        "Si estás en web o falta expo-clipboard, usa “Reportar problema” por correo.",
      );
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <MaterialIcons name="chevron-left" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.h1}>Soporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Acciones */}
        <Text style={styles.sectionLabel}>Contacto</Text>

        <GlassCard style={styles.card}>
          <Pressable style={styles.actionRow} onPress={openWhatsApp}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <MaterialIcons name="chat" size={20} color={Stitch.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>WhatsApp</Text>
                <Text style={styles.rowSub}>Escríbenos con tu diagnóstico</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.30)" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow} onPress={reportByEmail}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <MaterialIcons name="email" size={20} color={Stitch.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Reportar problema</Text>
                <Text style={styles.rowSub}>Enviar correo con diagnóstico</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.30)" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.actionRow} onPress={copyDiagnostics}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <MaterialIcons name="content-copy" size={20} color={Stitch.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Copiar diagnóstico</Text>
                <Text style={styles.rowSub}>Para pegarlo en soporte</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.30)" />
          </Pressable>
        </GlassCard>

        {/* FAQ */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Preguntas frecuentes</Text>

        <GlassCard style={styles.card}>
          {FAQ.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <View key={item.q}>
                <Pressable
                  style={styles.faqQRow}
                  onPress={() => setOpenIndex(open ? null : idx)}
                >
                  <Text style={styles.faqQ}>{item.q}</Text>
                  <MaterialIcons
                    name={open ? "expand-less" : "expand-more"}
                    size={22}
                    color="rgba(255,255,255,0.40)"
                  />
                </Pressable>

                {open && <Text style={styles.faqA}>{item.a}</Text>}

                {idx < FAQ.length - 1 && <View style={styles.divider} />}
              </View>
            );
          })}
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

  card: { borderRadius: 18, overflow: "hidden", paddingVertical: 2 },

  actionRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
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
  rowTitle: { color: "#fff", fontSize: 14, fontWeight: "800" },
  rowSub: { color: "rgba(255,255,255,0.50)", fontSize: 12, fontWeight: "600", marginTop: 2 },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 14,
    marginRight: 14,
  },

  faqQRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  faqQ: { flex: 1, color: "#fff", fontSize: 13, fontWeight: "800" },
  faqA: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    color: "rgba(255,255,255,0.70)",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },
});

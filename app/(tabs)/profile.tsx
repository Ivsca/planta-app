import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Stitch } from "../../constants/theme";
import { GlassCard } from "../../components/ui/GlassCard";

const AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCwrJxdLJcdBEJDPPz2M9uAgpBh9PS9fSNrRCyp9DhNJJ5yRgCnqVZ68A4KD_8C_vmwpmZEMZVqxhS7ueUa00Bu4wcAjJSBdWzgWVJL9dKVrK_MZt6lVLyoU11HxmWpWLE0ag-m90PEHk5CgEkpb5r94qAOTKr7pAiu8ULK4LZaxN4ppZg2rBYdr-XVX1jXveeOSWXr5Kmnj48Q4qYM-DHzWNyDdUKiptz6Kh50Aim4srGpzR2yXzEwR0d_-GdbQq5M96-iCjtq_2E";

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.h1}>Perfil</Text>

        <Pressable style={styles.iconBtn} hitSlop={10} onPress={() => {}}>
          <MaterialIcons name="settings" size={20} color={Stitch.colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: AVATAR }} style={styles.avatar} />
            </View>

            <View style={styles.proPill}>
              <Text style={styles.proText}>PRO</Text>
            </View>
          </View>

          <Text style={styles.name}>Ivanna</Text>

          <View style={styles.metaRow}>
            <View style={styles.levelPill}>
              <Text style={styles.levelText}>Nivel 3</Text>
            </View>
            <Text style={styles.metaText}>Planta de Transformación</Text>
          </View>
        </View>

        {/* General */}
        <Text style={styles.sectionLabel}>General</Text>

        <GlassCard style={styles.menuCard}>
          <MenuRow
            icon="analytics"
            title="Mi actividad"
            onPress={() => {}}
          />
          <Divider />
          <MenuRow
            icon="bookmark"
            title="Contenido guardado"
            onPress={() => {}}
          />
        </GlassCard>

        {/* Ajustes */}
        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Ajustes</Text>

        <GlassCard style={styles.menuCard}>
          <View style={styles.toggleRow}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <MaterialIcons name="notifications" size={20} color={Stitch.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Notificaciones</Text>
                <Text style={styles.rowSub}>Alertas de producción</Text>
              </View>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "rgba(255,255,255,0.12)",
                true: "rgba(33,196,93,0.45)",
              }}
              thumbColor={notifications ? Stitch.colors.primary : "#FFFFFF"}
            />
          </View>

          <Divider />

          <MenuRow icon="lock" title="Privacidad" onPress={() => {}} />
          <Divider />
          <MenuRow icon="help" title="Ayuda" onPress={() => {}} />
        </GlassCard>

        {/* Logout */}
        <View style={styles.logoutWrap}>
          <Pressable style={styles.logoutBtn} onPress={() => {}}>
            <MaterialIcons name="logout" size={18} color="rgba(255,255,255,0.55)" />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </Pressable>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </View>
  );
}

function MenuRow({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <MaterialIcons name={icon} size={20} color={Stitch.colors.primary} />
        </View>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>

      <MaterialIcons name="chevron-right" size={22} color="rgba(255,255,255,0.30)" />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },

  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Stitch.colors.divider,
  },
  h1: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: -0.2 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  content: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 24 },

  hero: { alignItems: "center", paddingVertical: 8, marginBottom: 14 },
  avatarWrap: { position: "relative" },
  avatarRing: {
    width: 132,
    height: 132,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: "rgba(33,196,93,0.20)",
    padding: 4,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 999 },

  proPill: {
    position: "absolute",
    right: 6,
    bottom: 6,
    backgroundColor: Stitch.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: Stitch.colors.bg,
  },
  proText: { color: "#000", fontSize: 10, fontWeight: "900", letterSpacing: 1 },

  name: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 12 },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  levelPill: {
    backgroundColor: "rgba(33,196,93,0.20)",
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.28)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  levelText: { color: Stitch.colors.primary, fontSize: 13, fontWeight: "900" },

  metaText: { color: "rgba(33,196,93,0.60)", fontSize: 13, fontWeight: "700" },

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

  menuCard: {
    borderRadius: 18,
    overflow: "hidden",
    paddingVertical: 2,
  },

  row: {
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

  toggleRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 14,
    marginRight: 14,
  },

  logoutWrap: { marginTop: 18, alignItems: "center" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  logoutText: { color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: "700" },
});

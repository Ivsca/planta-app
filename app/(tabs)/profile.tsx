import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { getAvatarUri } from "../profile/avatarStorage";

import { LoginModal } from "../../components/auth/LoginModal";
import { GlassCard } from "../../components/ui/GlassCard";
import { Stitch } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useRequireAuth } from "../../hooks/use-require-auth";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();
  const { requireAuth, loginModalVisible, dismissLogin, onLoginSuccess } =
    useRequireAuth();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);


  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        if (!isAuthenticated || !user?.id) {
          if (alive) setAvatarUri(null);
          return;
        }
        const saved = await getAvatarUri(user.id);
        if (alive) setAvatarUri(saved);
      })();

      return () => {
        alive = false;
      };
    }, [isAuthenticated, user?.id]),
  );

  const isAdmin = isAuthenticated && user?.role === "admin";
  const displayName = isAuthenticated && user ? user.name : "Visitante";

  const onPressActivity = () => {
    requireAuth(() => {
      router.push("/profile/activity");
    });
  };


  const onPressSaved = () => {
    requireAuth(() => {
      router.push("/saved" as Href);
    });
  };

  const onPressAdminPanel = () => {
    router.push("/admin" as Href);
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
        <Text style={styles.h1}>Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
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
          </View>

          <>
            <Text style={styles.name}>{displayName}</Text>

            <View style={styles.metaRow}>
              <View style={styles.levelPill}>
                <Text style={styles.levelText}>
                  {isAuthenticated && user?.role === "admin"
                    ? "Administrador"
                    : "Usuario"}
                </Text>
              </View>
              <Text style={styles.metaText}>
                {isAuthenticated ? user?.email : "Sin sesión"}
              </Text>
            </View>

            {isAuthenticated && (
              <Pressable
                style={styles.editProfileBtn}
                onPress={() => router.push("/profile/edit")}
              >
                <MaterialIcons
                  name="edit"
                  size={16}
                  color={Stitch.colors.primary}
                />
                <Text style={styles.editProfileText}>Editar perfil</Text>
              </Pressable>
            )}
          </>
        </View>

        <Text style={styles.sectionLabel}>General</Text>

        <GlassCard style={styles.menuCard}>
          {isAdmin ? (
            <MenuRow
              icon="admin-panel-settings"
              title="Panel de administrador"
              onPress={onPressAdminPanel}
            />
          ) : (
            <MenuRow
              icon="analytics"
              title="Mi actividad"
              onPress={onPressActivity}
            />
          )}

          <Divider />
           <MenuRow
           icon="bookmark"
            title="Contenido guardado"
            onPress={onPressSaved }
          />
        </GlassCard>

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Ajustes</Text>

        <GlassCard style={styles.menuCard}>
          <View style={styles.toggleRow}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <MaterialIcons
                  name="notifications"
                  size={20}
                  color={Stitch.colors.primary}
                />
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
          <MenuRow
            icon="lock"
            title="Seguridad y privacidad"
            onPress={() => router.push("/settings/privacy" as Href)}
          />
          <Divider />
          <MenuRow icon="help" title="Soporte" onPress={() => router.push("/settings/help" as Href)} />
        </GlassCard>

        <View style={styles.logoutWrap}>
          {isAuthenticated ? (
            <Pressable style={styles.logoutBtn} onPress={logout}>
              <MaterialIcons
                name="logout"
                size={18}
                color="rgba(255,255,255,0.55)"
              />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.logoutBtn,
                {
                  backgroundColor: Stitch.colors.primary,
                  borderRadius: 999,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                },
              ]}
              onPress={() => requireAuth(() => {})}
            >
              <MaterialIcons name="login" size={18} color={Stitch.colors.bg} />
              <Text
                style={[
                  styles.logoutText,
                  { color: Stitch.colors.bg, fontWeight: "900" },
                ]}
              >
                Iniciar sesión
              </Text>
            </Pressable>
          )}
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

      <MaterialIcons
        name="chevron-right"
        size={22}
        color="rgba(255,255,255,0.30)"
      />
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
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Stitch.colors.divider,
  },
  h1: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: -0.2 },

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

  avatarMask: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  avatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  name: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 12 },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
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

  menuCard: { borderRadius: 18, overflow: "hidden", paddingVertical: 2 },

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
  rowSub: {
    color: "rgba(255,255,255,0.50)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },

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

  logoutWrap: { marginTop: 18, alignItems: "center", gap: 12 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  logoutText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    fontWeight: "700",
  },

  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.20)",
  },
  editProfileText: {
    color: Stitch.colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
});

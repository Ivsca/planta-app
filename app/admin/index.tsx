// app/admin/index.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stitch } from "../../constants/theme";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Panel de administrador</Text>
      <Text style={styles.sub}>Gestión interna del sistema</Text>

      {/* CONTENIDO */}
      <Pressable
        style={styles.card}
        onPress={() => router.push({ pathname: "/admin/content" })}
      >
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="library-books" size={18} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Contenido</Text>
            <Text style={styles.cardSub}>Crear, editar y archivar</Text>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={22}
            color="rgba(255,255,255,0.35)"
          />
        </View>
      </Pressable>

      {/* USUARIOS */}
      <Pressable
        style={styles.card}
        onPress={() => router.push({ pathname: "/admin/users" })}
      >
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <MaterialIcons name="groups" size={18} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Polinizadores</Text>
            <Text style={styles.cardSub}>Buscar, roles y administración</Text>
          </View>

          <MaterialIcons
            name="chevron-right"
            size={22}
            color="rgba(255,255,255,0.35)"
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Stitch.colors.bg,
    paddingHorizontal: 16,
    paddingBottom: 16,
    // ⚠️ NO pongas paddingTop fijo aquí; lo estamos metiendo con insets.top
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  sub: {
    color: "rgba(255,255,255,0.60)",
    marginTop: 6,
    marginBottom: 16,
    fontWeight: "600",
  },

  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },

  cardSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
  },
});
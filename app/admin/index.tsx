import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Stitch } from "../../constants/theme";
import { useRouter, type Href } from "expo-router";


export default function AdminHome() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Panel de administrador</Text>

      <Pressable style={styles.card} onPress={() => router.push("/admin/content" as Href)}>
        <Text style={styles.cardTitle}>Contenido</Text>
        <Text style={styles.cardSub}>Crear, editar y archivar</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => router.push("/admin/users" as Href)}>
        <Text style={styles.cardTitle}>Usuarios</Text>
        <Text style={styles.cardSub}>Buscar, bloquear, roles</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg, padding: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "900", marginBottom: 16 },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },
  cardSub: { marginTop: 6, color: "rgba(255,255,255,0.55)", fontWeight: "600" },
});

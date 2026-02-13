import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

type ProfileMock = {
  displayName: string;
  email: string;
  energy: number;
};

export default function ProfileScreen() {
  const profile = useMemo<ProfileMock>(
    () => ({
      displayName: "Usuario/a",
      email: "sin-cuenta@demo.com",
      energy: 120,
    }),
    []
  );

  const onPressDisabled = (label: string) => {
    Alert.alert("Solo frontend", `${label} estará disponible cuando conectes backend o estado persistente.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.headerCard}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.email}>{profile.email}</Text>
        </View>
      </View>

      <View style={styles.energyCard}>
        <Text style={styles.energyLabel}>Energía</Text>
        <Text style={styles.energyValue}>{profile.energy} ⚡</Text>
        <Text style={styles.energyHint}>Acumula energía con actividad física (mock).</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option} onPress={() => onPressDisabled("Editar perfil")}>
          <Text style={styles.optionText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => onPressDisabled("Configuración")}>
          <Text style={styles.optionText}>Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.optionDanger]}
          onPress={() => onPressDisabled("Cerrar sesión")}
        >
          <Text style={[styles.optionText, styles.dangerText]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  headerCard: {
    backgroundColor: "#15151D",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2A2A35",
  },
  name: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  email: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },
  energyCard: {
    backgroundColor: "#15151D",
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  energyLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  energyValue: {
    color: "#D946EF",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },
  energyHint: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  section: {
    gap: 12,
  },
  option: {
    backgroundColor: "#15151D",
    borderRadius: 14,
    padding: 16,
  },
  optionDanger: {
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  dangerText: {
    color: "#EF4444",
  },
});

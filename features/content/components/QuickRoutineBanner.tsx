import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function QuickRoutineBanner({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.banner}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <MaterialIcons name="bolt" size={20} color={TOKENS.cyan} />
        </View>
        <View style={{ gap: 2 }}>
          <Text style={styles.title}>Rutina rápida</Text>
          <Text style={styles.sub}>Solo 5 minutos hoy</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={TOKENS.cyan} />
    </Pressable>
  );
}

const TOKENS = {
  surface: "#161616",
  border: "rgba(0,242,255,0.25)",
  cyan: "#00f2ff",
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: TOKENS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: TOKENS.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: "rgba(0,242,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "white", fontWeight: "900" },
  sub: { color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: "600" },
});

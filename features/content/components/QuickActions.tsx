// features/content/components/QuickActions.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { ContentCategory } from "../types";
import { getCategoryColor } from "../categoryColors";

type Action = {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  category: ContentCategory;
};

type Props = { onPress?: (id: string) => void };

export function QuickActions({ onPress }: Props) {
  const actions: Action[] = [
    { id: "programas", title: "Programas guiados", icon: "school", category: "Bienestar" },
    { id: "cortos", title: "Videos cortos", icon: "play-circle-outline", category: "Actividad física" },
    { id: "retos", title: "Retos semanales", icon: "emoji-events", category: "Comunidad" },
    { id: "habitos", title: "Hábitos diarios", icon: "checklist", category: "Medio ambiente" },
  ];

  return (
    <View style={{ gap: 12 }}>
      <Text style={styles.h2}>Empieza por aquí</Text>

      <View style={styles.grid}>
        {actions.map((a) => {
          const { base, soft } = getCategoryColor(a.category);

          return (
            <Pressable key={a.id} style={styles.tile} onPress={() => onPress?.(a.id)}>
              <View style={[styles.iconWrap, { backgroundColor: soft }]}>
                <MaterialIcons name={a.icon} size={22} color={base} />
              </View>
              <Text style={styles.tileText}>{a.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const TOKENS = {
  surface: "#161616",
  border: "rgba(255,255,255,0.10)",
};

const styles = StyleSheet.create({
  h2: { color: "white", fontSize: 18, fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    width: "48%",
    backgroundColor: TOKENS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: TOKENS.border,
    padding: 14,
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    height: 44,
    width: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: { color: "white", fontSize: 12, fontWeight: "800", textAlign: "center" },
});

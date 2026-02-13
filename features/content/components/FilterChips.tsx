import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { DiscoverChip, ContentCategory } from "../types";

type Props = {
  chips: DiscoverChip[];
  active: "Todo" | ContentCategory;
  onChange: (id: "Todo" | ContentCategory) => void;
};

export function FilterChips({ chips, active, onChange }: Props) {
  return (
    <FlatList
      data={chips}
      keyExtractor={(c) => c.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const isActive = item.id === active;
        return (
          <Pressable
            onPress={() => onChange(item.id)}
            style={[styles.chip, isActive ? styles.chipActive : styles.chipIdle]}
          >
            <Text style={[styles.chipText, isActive ? styles.textActive : styles.textIdle]}>
              {item.label}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const TOKENS = {
  surface: "#161616",
  border: "rgba(255,255,255,0.10)",
  primary: "#e619e5",
  textIdle: "rgba(255,255,255,0.70)",
};

const styles = StyleSheet.create({
  container: { paddingVertical: 4, gap: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: { backgroundColor: TOKENS.primary, borderColor: "transparent" },
  chipIdle: { backgroundColor: TOKENS.surface, borderColor: TOKENS.border },
  chipText: { fontSize: 12 },
  textActive: { color: "white", fontWeight: "700" },
  textIdle: { color: TOKENS.textIdle, fontWeight: "600" },
});

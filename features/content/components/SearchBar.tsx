import React from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  onPressFilters?: () => void;
};

export function SearchBar({ value, onChangeText, onPressFilters }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <MaterialIcons name="search" size={20} color={TOKENS.primary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Buscar videos, rutinas, hábitos…"
          placeholderTextColor="rgba(255,255,255,0.35)"
          style={styles.input}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <Pressable onPress={onPressFilters} style={styles.filterBtn} hitSlop={10}>
        <MaterialIcons name="tune" size={20} color={TOKENS.primary} />
      </Pressable>
    </View>
  );
}

const TOKENS = {
  bg: "#0A0A0A",
  surface: "#161616",
  border: "rgba(255,255,255,0.10)",
  primary: "#e619e5",
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  inputWrap: {
    flex: 1,
    height: 50,
    backgroundColor: TOKENS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: TOKENS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: { flex: 1, color: "white", fontSize: 14 },
  filterBtn: {
    height: 50,
    width: 50,
    borderRadius: 14,
    backgroundColor: TOKENS.surface,
    borderWidth: 1,
    borderColor: TOKENS.border,
    alignItems: "center",
    justifyContent: "center",
  },
});

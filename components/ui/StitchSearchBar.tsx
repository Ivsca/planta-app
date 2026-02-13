import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Stitch } from "../../constants/theme";
import { GlassCard } from "./GlassCard";

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

export function StitchSearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <GlassCard style={styles.wrap} intensity={14}>
      <MaterialIcons name="search" size={20} color="rgba(255,255,255,0.55)" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? "Buscar..."}
        placeholderTextColor="rgba(255,255,255,0.35)"
        style={styles.input}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Stitch.radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 24,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

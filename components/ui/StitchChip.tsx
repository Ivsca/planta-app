import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { Stitch } from "../../constants/theme";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export function StitchChip({ label, active, onPress, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        active ? styles.active : styles.inactive,
        style,
      ]}
    >
      <Text style={[styles.text, active ? styles.textActive : styles.textInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Stitch.radius.pill,
    borderWidth: 1,
  },
  active: {
    backgroundColor: "rgba(33,196,93,0.20)",
    borderColor: "rgba(33,196,93,0.30)",
  },
  inactive: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderColor: "rgba(255,255,255,0.08)",
  },
  text: { fontSize: 12, fontWeight: "800" },
  textActive: { color: Stitch.colors.primary },
  textInactive: { color: "rgba(255,255,255,0.65)" },
});

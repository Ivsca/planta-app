import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, View } from "react-native";
import { Stitch } from "../../constants/theme";

type Props = {
  label: string;
  onPress?: () => void;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export function StitchButton({
  label,
  onPress,
  iconRight,
  style,
  textStyle,
  disabled,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{label}</Text>
      {iconRight ? <View style={{ marginLeft: 8 }}>{iconRight}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Stitch.radius.pill,
    backgroundColor: Stitch.colors.primary,
    shadowColor: Stitch.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  text: {
    color: Stitch.colors.bg,
    fontWeight: "900",
    fontSize: 14,
  },
});

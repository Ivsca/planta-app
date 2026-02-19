import React from "react";
import { View, Text } from "react-native";
import { Stitch } from "../../../constants/theme";

export default function AdminContent() {
  return (
    <View style={{ flex: 1, backgroundColor: Stitch.colors.bg, padding: 16 }}>
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "900" }}>Contenido (admin)</Text>
    </View>
  );
}

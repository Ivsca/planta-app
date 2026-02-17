// app/modal.tsx
import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

type UiTypeChip = "Todo" | "Video" | "Artículo" | "Rutina" | "Reto";

const TYPE_OPTIONS: UiTypeChip[] = ["Todo", "Video", "Artículo", "Rutina", "Reto"];

function normalizeTypeParam(v: unknown): UiTypeChip {
  if (v === "Video" || v === "Artículo" || v === "Rutina" || v === "Reto") return v;
  return "Todo";
}

export default function ModalScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const current = useMemo(() => normalizeTypeParam(params.type), [params.type]);

  const pick = (t: UiTypeChip) => {
    // Volvemos a Discover actualizando params: /discover?type=Video
    router.dismiss();
    router.setParams({ type: t === "Todo" ? undefined : t });
  };

  return (
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Tipo de contenido</Text>
          <Pressable onPress={() => router.dismiss()} hitSlop={10}>
            <Text style={styles.close}>Cerrar</Text>
          </Pressable>
        </View>

        {TYPE_OPTIONS.map((t) => {
          const active = t === current;
          return (
            <Pressable
              key={t}
              onPress={() => pick(t)}
              style={[styles.option, active && styles.optionActive]}
              accessibilityRole="button"
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0F0F12",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  close: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "800",
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginTop: 10,
  },
  optionActive: {
    backgroundColor: "rgba(33,196,93,0.20)",
    borderColor: "rgba(33,196,93,0.35)",
  },
  optionText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "800",
  },
  optionTextActive: {
    color: "#21c45d",
  },
});

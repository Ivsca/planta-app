// features/content/components/ContentRowItem.tsx
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "../../articles/categoryTheme";
import { formatDuration, formatViews } from "../selectors";
import type { ContentItem } from "../types";

type Props = {
  item: ContentItem;
  onPress?: () => void; // opcional: override (por ejemplo abrir modal)
};

export function ContentRowItem({ item, onPress }: Props) {
  const duration = useMemo(
    () => formatDuration(item.durationSec),
    [item.durationSec],
  );
  const views = useMemo(() => formatViews(item.views), [item.views]);
  const { base } = getCategoryColor(item.category);

  const handlePress = () => {
    if (onPress) return onPress();
    router.push(`/content/${item.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.row}
      accessibilityRole="button"
      android_ripple={{ color: "rgba(255,255,255,0.06)" }}
    >
      <View style={styles.thumb}>
        {!!item.thumbnail && (
          <Image
            source={{ uri: item.thumbnail }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        )}
        {!!duration && <Text style={styles.duration}>{duration}</Text>}
      </View>

      <View style={styles.meta}>
        <Text style={[styles.kicker, { color: base }]}>{item.category}</Text>

        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.miniRow}>
          {!!views && <Text style={styles.miniText}>{views} vistas</Text>}
          <View style={styles.dot} />
          <Text style={styles.miniText}>
            {item.isNew ? "Nuevo" : "Reciente"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const TOKENS = {
  surface: "#161616",
  border: "rgba(255,255,255,0.10)",
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  thumb: {
    width: 120,
    height: 76,
    backgroundColor: TOKENS.surface,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: TOKENS.border,
    position: "relative",
  },
  duration: {
    position: "absolute",
    right: 6,
    bottom: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    color: "white",
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  meta: { flex: 1, gap: 4 },
  kicker: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  miniRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  miniText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 10,
    fontWeight: "700",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
});

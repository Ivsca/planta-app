import React from "react";
import { View, Text, FlatList, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ContentItem } from "../types";
import { formatDuration } from "../selectors";
import { getCategoryColor } from "../categoryColors";


type Props = {
  title: string;
  items: ContentItem[];
  onPressAll?: () => void;
};

export function FeaturedCarousel({ title, items, onPressAll }: Props) {
  return (
    <View style={{ gap: 12 }}>
      <View style={styles.headerRow}>
        <Text style={styles.h2}>{title}</Text>
        <Pressable onPress={onPressAll} hitSlop={10}>
          <Text style={styles.link}>Ver todo</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingRight: 6 }}
        renderItem={({ item }) => <FeaturedCard item={item} />}
      />
    </View>
  );
}

function FeaturedCard({ item }: { item: ContentItem }) {
  const w = Math.min(320, Math.round(Dimensions.get("window").width * 0.72));
  const duration = formatDuration(item.durationSec);
  const { base } = getCategoryColor(item.category);

  return (
    <Pressable style={[styles.card, { width: w }]} android_ripple={{ color: "rgba(255,255,255,0.08)" }}>
      <View style={styles.imageWrap}>
        {!!item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.image} />}
        <View style={styles.scrim} />
        {!!duration && <Text style={styles.badge}>{duration}</Text>}
        <Pressable style={styles.bookmark} hitSlop={10}>
          <MaterialIcons name="bookmark-border" size={18} color="white" />
        </Pressable>
        <View style={styles.bottomText}>
          <Text style={[styles.kicker, { color: base }]}>{item.category}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}


const TOKENS = {
  primary: "#e619e5",
  surface: "#161616",
  border: "rgba(255,255,255,0.10)",
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  h2: { color: "white", fontSize: 18, fontWeight: "800" },
  link: { color: TOKENS.primary, fontSize: 12, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },

  card: { backgroundColor: TOKENS.surface, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: TOKENS.border },
  imageWrap: { aspectRatio: 4 / 5, position: "relative" },
  image: { width: "100%", height: "100%" },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: TOKENS.primary,
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "800",
  },
  bookmark: {
    position: "absolute",
    top: 10,
    right: 10,
    height: 34,
    width: 34,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomText: { position: "absolute", left: 12, right: 12, bottom: 12, gap: 4 },
  kicker: { color: TOKENS.primary, fontSize: 10, fontWeight: "900", letterSpacing: 1.2, textTransform: "uppercase" },
  title: { color: "white", fontSize: 16, fontWeight: "800", lineHeight: 20 },
});

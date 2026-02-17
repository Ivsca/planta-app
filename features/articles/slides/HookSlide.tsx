import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ArticleSlideShell from "../ArticleSlideShell";
import type { HookSlide as HookSlideType } from "../types";

type Props = {
  data: HookSlideType;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  categoryLabel?: string;
};

const PRIMARY = "#13EC5B";
const TEXT_DIM = "rgba(255,255,255,0.60)";
const BORDER = "rgba(19,236,91,0.10)";

export default function HookSlide({
  data,
  slideIndex,
  total,
  onBack,
  onNext,
  categoryLabel = "Medio Ambiente",
}: Props) {
  const progressText = `${slideIndex + 1} / ${total}`;

  // ✅ Prioriza imagen local si existe, si no usa URL remota
  const heroSource =
    data.heroImage ? data.heroImage : data.heroUri ? { uri: data.heroUri } : null;

  return (
    <ArticleSlideShell progressText={progressText} onBack={onBack} onNext={onNext}>
      {/* Category badge */}
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{categoryLabel.toUpperCase()}</Text>
        </View>
      </View>

      {/* Title & subtitle */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>

      {/* Hero */}
      <View style={styles.heroWrap}>
        <View style={styles.glow} pointerEvents="none" />

        {heroSource ? (
          <Image
            source={heroSource}
            resizeMode="cover"
            style={styles.heroImage}
            accessible
            accessibilityLabel="Ilustración del artículo"
          />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Text style={styles.heroPlaceholderText}>Ilustración</Text>
          </View>
        )}
      </View>
    </ArticleSlideShell>
  );
}

const styles = StyleSheet.create({
  badgeRow: { marginTop: 12, marginBottom: 22 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: "black",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },

  titleBlock: { marginBottom: 18 },
  title: {
    color: "white",
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 10,
    color: TEXT_DIM,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: "92%",
  },

  heroWrap: {
    width: "100%",
    height: 250,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "rgba(18,18,24,0.20)",
    overflow: "hidden",
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    transform: [{ scale: 1.15 }],
  },

  // ✅ En vez de 250x250 fijo (que no respeta el contenedor), hazla “cover” real del wrap
  heroImage: {
    width: "100%",
    height: "100%",
  },

  // ✅ Esto faltaba en tu archivo
  heroPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  heroPlaceholderText: { color: "rgba(255,255,255,0.35)" },
});

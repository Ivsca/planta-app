// features/articles/slides/ExampleSlide.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, type ImageSourcePropType } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ArticleSlideShell from "../ArticleSlideShell";
import { ExampleSlide as ExampleSlideType } from "../types";

type Props = {
  data: ExampleSlideType;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
};

const PRIMARY = "#13EC5B";
const TEXT_DIM = "rgba(255,255,255,0.60)";
const BORDER = "rgba(255,255,255,0.10)";
const CARD_BG = "rgba(18,18,24,0.35)";

// Fallbacks (mantengo tus imágenes actuales por defecto)
const FALLBACK_BEFORE = require("../../../assets/images/Trafico.jpg");
const FALLBACK_AFTER = require("../../../assets/images/bicicleta.jpg");

function toImageSource(
  img?: ImageSourcePropType,
  uri?: string,
  fallback?: ImageSourcePropType
): ImageSourcePropType {
  if (img) return img;
  if (uri && typeof uri === "string" && uri.trim().length > 0) return { uri };
  return fallback ?? FALLBACK_BEFORE;
}

export default function ExampleSlide({
  data,
  slideIndex,
  total,
  onBack,
  onNext,
}: Props) {
  const progressText = `${slideIndex + 1} / ${total}`;

  // ⚠️ Si todavía no agregaste estas props en el type, TS te va a marcar error.
  // Debes agregar beforeImage/beforeUri/afterImage/afterUri al ExampleSlide interface.
  const beforeSource = useMemo(
    () =>
      toImageSource(
        data.beforeImage,
        data.beforeUri,
        FALLBACK_BEFORE
      ),
    [data]
  );

  const afterSource = useMemo(
    () =>
      toImageSource(
        (data as any).afterImage,
        (data as any).afterUri,
        FALLBACK_AFTER
      ),
    [data]
  );

  return (
    <ArticleSlideShell progressText={progressText} onBack={onBack} onNext={onNext}>
      {/* Title */}
      <Text style={styles.heroTitle}>{data.title}</Text>

      <View style={styles.stack}>
        {/* Antes */}
        <View style={styles.cardBefore}>
          <View style={styles.rowTop}>
            <View style={styles.iconBoxBefore}>
              <MaterialIcons name="directions-car" size={28} color="rgba(255,255,255,0.55)" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>ANTES</Text>
              <Text style={styles.cardTitle}>{data.before}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MaterialIcons name="cloud-queue" size={18} color="rgba(255,255,255,0.45)" />
            <Text style={styles.metaText}>Más emisiones y más consumo</Text>
          </View>

          <Image source={beforeSource} style={styles.visualImage} resizeMode="cover" />
        </View>

        {/* Badge Cambio */}
        <View style={styles.badgeWrap}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CAMBIO</Text>
          </View>
        </View>

        {/* Después */}
        <View style={styles.cardAfter}>
          <View style={styles.rowTop}>
            <View style={styles.iconBoxAfter}>
              <MaterialIcons name="directions-walk" size={28} color="#0B0B0F" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.kickerAfter}>DESPUÉS</Text>
              <Text style={styles.cardTitleAfter}>{data.after}</Text>
            </View>
          </View>

          <View style={styles.goodList}>
            <View style={styles.goodRow}>
              <MaterialIcons name="eco" size={18} color={PRIMARY} />
              <Text style={styles.goodText}>Menos impacto ambiental</Text>
            </View>
            <View style={styles.goodRow}>
              <MaterialIcons name="favorite" size={18} color={PRIMARY} />
              <Text style={styles.goodText}>Más vitalidad y salud</Text>
            </View>
          </View>

          <Image source={afterSource} style={styles.visualImage} resizeMode="cover" />
        </View>
      </View>
    </ArticleSlideShell>
  );
}

const styles = StyleSheet.create({
  heroTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 18,
    letterSpacing: -0.2,
  },

  stack: { marginTop: 4, gap: 14 },

  cardBefore: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardAfter: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(19,236,91,0.06)",
    borderWidth: 2,
    borderColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  rowTop: { flexDirection: "row", gap: 12, alignItems: "center" },

  iconBoxBefore: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxAfter: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  kicker: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  kickerAfter: {
    color: "rgba(19,236,91,0.90)",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  cardTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  cardTitleAfter: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 2,
  },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  metaText: { color: "rgba(255,255,255,0.55)", fontSize: 14 },

  badgeWrap: { alignItems: "center", marginTop: -6, marginBottom: -6 },
  badge: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: PRIMARY,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  badgeText: {
    color: "#0B0B0F",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  goodList: { marginTop: 12, gap: 8 },
  goodRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  goodText: { color: "rgba(255,255,255,0.88)", fontSize: 14.5, fontWeight: "600" },


  visualImage: { marginTop: 14, width: "100%", height: 160, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", },

  visualAfter: {
    backgroundColor: "rgba(19,236,91,0.10)",
    borderColor: "rgba(19,236,91,0.20)",
  },
  visualText: { color: TEXT_DIM, fontSize: 13 },
});

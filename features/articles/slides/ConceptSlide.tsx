import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ArticleSlideShell from "../ArticleSlideShell";
import ExpandableText from "../components/ExpandableText";
import { ConceptSlide as ConceptSlideType, ConceptBullet } from "../types";

type Props = {
  data: ConceptSlideType;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
};

const PRIMARY = "#13EC5B";
const TEXT_DIM = "rgba(255,255,255,0.60)";
const CARD_BG = "rgba(18,18,24,0.55)";
const CARD_BORDER = "rgba(19,236,91,0.16)";

function iconName(icon?: ConceptBullet["icon"]): keyof typeof MaterialIcons.glyphMap {
  switch (icon) {
    case "walk":
      return "directions-walk";
    case "eco":
      return "eco";
    case "park":
      return "park";
    default:
      return "info-outline";
  }
}

export default function ConceptSlide({
  data,
  slideIndex,
  total,
  onBack,
  onNext,
}: Props) {
  const progressText = `${slideIndex + 1} / ${total}`;

  return (
    <ArticleSlideShell
      progressText={progressText}
      onBack={onBack}
      onNext={onNext}
    >
      {/* Header del slide */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{data.title}</Text>

        {data.subtitle ? (
          <Text style={styles.subtitle}>{data.subtitle}</Text>
        ) : null}
      </View>

      {/* Bullets */}
      <View style={styles.list}>
        {data.bullets.map((b, i) => (
          <View key={`${data.id}-b${i}`} style={styles.card}>
            <View style={styles.iconBox}>
              <MaterialIcons
                name={iconName(b.icon)}
                size={26}
                color={PRIMARY}
              />
            </View>

            <View style={styles.textCol}>
              <Text style={styles.bulletTitle}>{b.title}</Text>

              {/* 🔥 Texto largo ahora expandible */}
              <ExpandableText text={b.body} collapsedChars={260} />
            </View>
          </View>
        ))}
      </View>
    </ArticleSlideShell>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    marginTop: 12,
    marginBottom: 26,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 36,
    letterSpacing: -0.4,
  },

  subtitle: {
    marginTop: 12,
    color: TEXT_DIM,
    fontSize: 15.5,
    lineHeight: 22,
    maxWidth: "95%",
  },

  list: {
    gap: 18,
  },

  card: {
    flexDirection: "row",
    gap: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(19,236,91,0.12)",
    borderWidth: 1,
    borderColor: "rgba(19,236,91,0.28)",
    justifyContent: "center",
    alignItems: "center",
  },

  textCol: {
    flex: 1,
  },

  bulletTitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 22,
  },
});

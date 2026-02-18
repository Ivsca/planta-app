import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ArticleSlideShell from "../ArticleSlideShell";
import ExpandableText from "../components/ExpandableText";
import type { ConceptSlide as ConceptSlideType } from "../types";
import type { CategoryTheme } from "../categoryTheme";

type Props = {
  data: ConceptSlideType;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  theme: CategoryTheme;
};

const TEXT_DIM = "rgba(255,255,255,0.60)";
const CARD_BG = "rgba(18,18,24,0.55)";

function safeIconName(
  icon?: React.ComponentProps<typeof MaterialIcons>["name"]
): React.ComponentProps<typeof MaterialIcons>["name"] {
  return icon ?? "info-outline";
}

export default function ConceptSlide({
  data,
  slideIndex,
  total,
  onBack,
  onNext,
  theme,
}: Props) {
  const progressText = `${slideIndex + 1} / ${total}`;

  return (
    <ArticleSlideShell
      theme={theme} 
      progressText={progressText}
      onBack={onBack}
      onNext={onNext}
    >
      {/* Header */}
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{data.title}</Text>
        {data.subtitle ? (
          <Text style={styles.subtitle}>{data.subtitle}</Text>
        ) : null}
      </View>

      {/* Bullets */}
      <View style={styles.list}>
        {data.bullets.map((b, i) => (
          <View
            key={`${data.id}-b${i}`}
            style={[styles.card, { borderColor: theme.border }]}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: theme.soft,
                  borderColor: theme.border,
                },
              ]}
            >
              <MaterialIcons
                name={safeIconName(b.icon)}
                size={26}
                color={theme.base}
              />
            </View>

            <View style={styles.textCol}>
              <Text style={styles.bulletTitle}>{b.title}</Text>
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
  },

  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
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

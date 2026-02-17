import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import ArticleSlideShell from "../ArticleSlideShell";
import { ActionSlide as ActionSlideType } from "../types";

type Props = {
  data: ActionSlideType;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
};

const PRIMARY = "#13EC5B";
const TEXT_DIM = "rgba(255,255,255,0.60)";
const CARD_BG = "rgba(18,18,24,0.35)";
const CARD_BORDER = "rgba(255,255,255,0.10)";

export default function ActionSlide({
  data,
  slideIndex,
  total,
  onBack,
  onNext,
}: Props) {
  const progressText = `${slideIndex + 1} / ${total}`;

  const [checked, setChecked] = useState<boolean[]>(
    Array(data.actions.length).fill(false)
  );

  const toggle = (index: number) => {
    setChecked((prev) =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  const allDone = useMemo(
    () => checked.every(Boolean),
    [checked]
  );

  return (
    <ArticleSlideShell
      progressText={progressText}
      onBack={onBack}
      onNext={onNext}
      nextLabel={allDone ? "Lo haré" : "Siguiente"}
    >
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>
          {data.title}
        </Text>
        <Text style={styles.subtitle}>
          Pequeños cambios hoy para un mañana mejor.
        </Text>
      </View>

      {/* Checklist */}
      <View style={styles.list}>
        {data.actions.map((action, i) => {
          const isChecked = checked[i];

          return (
            <Pressable
              key={`${data.id}-a${i}`}
              onPress={() => toggle(i)}
              style={[
                styles.card,
                isChecked && styles.cardChecked,
              ]}
            >
              <View style={styles.leftIcon}>
                <MaterialIcons
                  name="eco"
                  size={22}
                  color={PRIMARY}
                />
              </View>

              <Text
                style={[
                  styles.actionText,
                  isChecked && styles.actionTextChecked,
                ]}
              >
                {action}
              </Text>

              <MaterialIcons
                name={isChecked ? "check-circle" : "radio-button-unchecked"}
                size={24}
                color={isChecked ? PRIMARY : "rgba(255,255,255,0.35)"}
              />
            </Pressable>
          );
        })}
      </View>

      {/* Subtle decorative glow */}
      <View style={styles.glowWrap}>
        <View style={styles.glow} />
      </View>
    </ArticleSlideShell>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: 8,
    marginBottom: 18,
  },
  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 38,
  },
  subtitle: {
    marginTop: 8,
    color: TEXT_DIM,
    fontSize: 16,
  },

  list: {
    marginTop: 12,
    gap: 14,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },

  cardChecked: {
    borderColor: PRIMARY,
    backgroundColor: "rgba(19,236,91,0.08)",
  },

  leftIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(19,236,91,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  actionTextChecked: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },

  glowWrap: {
    marginTop: 40,
    alignItems: "center",
  },
  
});

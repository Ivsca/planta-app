import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ArticleSlideShell from "../ArticleSlideShell";
import type { QuizSlide as QuizSlideType } from "../types";
import type { CategoryTheme } from "../categoryTheme"; 

type Props = {
  data: QuizSlideType;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  theme: CategoryTheme;
};

const TEXT_DIM = "rgba(255,255,255,0.60)";
const BORDER = "rgba(255,255,255,0.10)";
const WRONG_BORDER = "rgba(255,80,80,0.55)";
const WRONG_BG = "rgba(255,80,80,0.06)";
const WRONG_BORDER_STRONG = "rgba(255,80,80,0.85)";

export default function QuizSlide({
  data,
  slideIndex,
  total,
  onBack,
  onNext,
  theme,
}: Props) {
  const progressText = `${slideIndex + 1} / ${total}`;

  const questions = data.questions ?? [];
  const qTotal = questions.length;

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[qIndex];

  const isCorrect = useMemo(() => {
    if (!q || selected === null) return false;
    return selected === q.correctIndex;
  }, [q, selected]);

  const canSubmit = selected !== null;
  const isLastQuestion = qIndex === qTotal - 1;

  const nextLabel = useMemo(() => {
    if (!submitted) return "Revisar respuesta";
    if (isLastQuestion) return "Finalizar artículo";
    return "Siguiente pregunta";
  }, [submitted, isLastQuestion]);

  const handlePick = (i: number) => {
    if (submitted) return;
    setSelected(i);
  };

  const resetForNextQuestion = () => {
    setSelected(null);
    setSubmitted(false);
  };

  const handleNext = () => {
    if (!q) return onNext();

    if (!submitted) {
      if (!canSubmit) return;
      setSubmitted(true);
      if (isCorrect) setScore((s) => s + 1);
      return;
    }

    if (!isLastQuestion) {
      setQIndex((i) => i + 1);
      resetForNextQuestion();
      return;
    }

    onNext();
  };

  if (!q || qTotal === 0) {
    return (
      <ArticleSlideShell
      theme={theme}
        progressText={progressText}
        onBack={onBack}
        onNext={onNext}
        nextLabel="Finalizar artículo"
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
          No hay preguntas configuradas.
        </Text>
      </ArticleSlideShell>
    );
  }

  return (
    <ArticleSlideShell
      theme={theme}
      progressText={progressText}
      onBack={onBack}
      onNext={handleNext}
      nextLabel={nextLabel}
    >
      {/* Header */}
      <View style={styles.quizTop}>
        <Text style={[styles.quizKicker, { color: theme.base }]}>PREGUNTA</Text>

        <Text style={styles.quizCounter}>
          {qIndex + 1} / {qTotal}
        </Text>

        <View style={[styles.progressBar, { backgroundColor: theme.soft }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.round(((qIndex + 1) / qTotal) * 100)}%`,
                backgroundColor: theme.base,
              },
            ]}
          />
        </View>

        <Text style={styles.quizTitle}>{data.title}</Text>

        <Text style={styles.prompt}>{q.prompt}</Text>
      </View>

      {/* Opciones */}
      <View style={styles.options}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOption = submitted && i === q.correctIndex;
          const isWrongSelected = submitted && isSelected && i !== q.correctIndex;

          return (
            <Pressable
              key={`${data.id}-q${qIndex}-opt${i}`}
              onPress={() => handlePick(i)}
              style={[
                styles.optionCard,
                isSelected && { borderColor: theme.border, backgroundColor: theme.soft },
                isCorrectOption && { borderColor: theme.base, backgroundColor: theme.soft },
                isWrongSelected && { borderColor: WRONG_BORDER, backgroundColor: WRONG_BG },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.optionTitle,
                    isCorrectOption && { color: theme.base },
                  ]}
                >
                  {opt.title}
                </Text>

                {opt.detail ? (
                  <Text style={styles.optionDetail}>{opt.detail}</Text>
                ) : null}
              </View>

              <View style={styles.radioWrap}>
                <View
                  style={[
                    styles.radioOuter,
                    isSelected && { borderColor: theme.base },
                    isCorrectOption && { borderColor: theme.base },
                    isWrongSelected && { borderColor: WRONG_BORDER_STRONG },
                  ]}
                >
                  {isSelected ? (
                    <View style={[styles.radioDot, { backgroundColor: theme.base }]} />
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Feedback */}
      {submitted && selected !== null ? (
        <View
          style={[
            styles.feedback,
            {
              backgroundColor: theme.soft,
              borderColor: theme.border,
            },
          ]}
        >
          <MaterialIcons
            name={isCorrect ? "info-outline" : "error-outline"}
            size={20}
            color={theme.base}
          />
          <Text style={styles.feedbackText}>
            <Text style={[styles.feedbackStrong, { color: theme.base }]}>
              {isCorrect ? "¡Correcto! " : "Incorrecto. "}
            </Text>
            {q.explanation}
          </Text>
        </View>
      ) : (
        <View style={styles.helperBox}>
          <MaterialIcons
            name="touch-app"
            size={20}
            color="rgba(255,255,255,0.45)"
          />
          <Text style={styles.helperText}>Elige una opción para continuar.</Text>
        </View>
      )}

      {/* Score solo al final */}
      {submitted && isLastQuestion ? (
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>
            Resultado:{" "}
            <Text style={{ color: theme.base, fontWeight: "900" }}>
              {score} / {qTotal}
            </Text>
          </Text>
        </View>
      ) : null}
    </ArticleSlideShell>
  );
}

const styles = StyleSheet.create({
  quizTop: { marginTop: 8, marginBottom: 10 },

  quizKicker: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  quizCounter: {
    marginTop: 4,
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },

  progressBar: {
    marginTop: 10,
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  quizTitle: {
    marginTop: 14,
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },

  prompt: {
    marginTop: 10,
    color: "rgba(255,255,255,0.80)",
    fontSize: 15.5,
    lineHeight: 22,
  },

  options: { marginTop: 14, gap: 12 },

  optionCard: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(18,18,24,0.30)",
  },

  optionTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14.5,
    fontWeight: "800",
    lineHeight: 20,
  },
  optionDetail: {
    marginTop: 6,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12.5,
    lineHeight: 18,
  },

  radioWrap: { justifyContent: "flex-start", paddingTop: 2 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  feedback: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  feedbackText: {
    flex: 1,
    color: "rgba(255,255,255,0.80)",
    fontSize: 13.5,
    lineHeight: 18,
  },
  feedbackStrong: { fontWeight: "900" },

  helperBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  helperText: {
    flex: 1,
    color: TEXT_DIM,
    fontSize: 13.5,
    lineHeight: 18,
  },

  scoreBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  scoreText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13.5,
    fontWeight: "800",
  },
});

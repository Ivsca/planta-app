import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import ArticleSlideShell from "../ArticleSlideShell";
import type { QuizSlide as QuizSlideType } from "../types";

type Props = {
  data: QuizSlideType;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void; // fin del artículo
};

const PRIMARY = "#13EC5B";
const TEXT_DIM = "rgba(255,255,255,0.60)";
const BORDER = "rgba(255,255,255,0.10)";

export default function QuizSlide({
  data,
  slideIndex,
  total,
  onBack,
  onNext,
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

    // 1) Si no ha enviado aún: enviar (mostrar feedback)
    if (!submitted) {
      if (!canSubmit) return;
      setSubmitted(true);
      if (isCorrect) setScore((s) => s + 1);
      return;
    }

    // 2) Si ya envió y no es la última pregunta: avanzar
    if (!isLastQuestion) {
      setQIndex((i) => i + 1);
      resetForNextQuestion();
      return;
    }

    // 3) Última pregunta + ya enviado => fin del artículo
    onNext();
  };

  // Caso borde: no hay preguntas
  if (!q || qTotal === 0) {
    return (
      <ArticleSlideShell
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
      progressText={progressText}
      onBack={onBack}
      onNext={handleNext}
      nextLabel={nextLabel}
    >
      {/* Mini header interno del quiz */}
      <View style={styles.quizTop}>
        <Text style={styles.quizKicker}>PREGUNTA</Text>
        <Text style={styles.quizCounter}>
          {qIndex + 1} / {qTotal}
        </Text>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(((qIndex + 1) / qTotal) * 100)}%` },
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
          const isWrongSelected =
            submitted && isSelected && i !== q.correctIndex;

          return (
            <Pressable
              key={`${data.id}-q${qIndex}-opt${i}`}
              onPress={() => handlePick(i)}
              style={[
                styles.optionCard,
                isSelected && styles.optionSelected,
                isCorrectOption && styles.optionCorrect,
                isWrongSelected && styles.optionWrong,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.optionTitle,
                    isCorrectOption && styles.optionTitleCorrect,
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
                    isSelected && styles.radioOuterSelected,
                    isCorrectOption && styles.radioOuterCorrect,
                    isWrongSelected && styles.radioOuterWrong,
                  ]}
                >
                  {isSelected ? <View style={styles.radioDot} /> : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Feedback */}
      {submitted && selected !== null ? (
        <View style={styles.feedback}>
          <MaterialIcons
            name={isCorrect ? "info-outline" : "error-outline"}
            size={20}
            color={PRIMARY}
          />
          <Text style={styles.feedbackText}>
            <Text style={styles.feedbackStrong}>
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
          <Text style={styles.helperText}>
            Elige una opción para continuar.
          </Text>
        </View>
      )}

      {/* Score visible solo al final (cuando ya respondió la última) */}
      {submitted && isLastQuestion ? (
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>
            Resultado:{" "}
            <Text style={{ color: PRIMARY, fontWeight: "900" }}>
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
    color: PRIMARY,
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
    backgroundColor: "rgba(19,236,91,0.20)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: PRIMARY,
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
  optionSelected: {
    borderColor: "rgba(19,236,91,0.40)",
    backgroundColor: "rgba(19,236,91,0.06)",
  },
  optionCorrect: {
    borderColor: PRIMARY,
    backgroundColor: "rgba(19,236,91,0.10)",
  },
  optionWrong: {
    borderColor: "rgba(255,80,80,0.55)",
    backgroundColor: "rgba(255,80,80,0.06)",
  },

  optionTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14.5,
    fontWeight: "800",
    lineHeight: 20,
  },
  optionTitleCorrect: { color: PRIMARY },
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
  radioOuterSelected: { borderColor: PRIMARY },
  radioOuterCorrect: { borderColor: PRIMARY },
  radioOuterWrong: { borderColor: "rgba(255,80,80,0.85)" },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },

  feedback: {
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(19,236,91,0.10)",
    borderWidth: 1,
    borderColor: "rgba(19,236,91,0.22)",
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
  feedbackStrong: { color: PRIMARY, fontWeight: "900" },

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

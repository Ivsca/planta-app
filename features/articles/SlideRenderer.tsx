import React, { useMemo } from "react";

import { getCategoryTheme } from "./categoryTheme";
import type { CategoryTheme } from "./categoryTheme";

import type { ContentCategory } from "../content/types";
import { CATEGORY_LABEL } from "../content/category"; // ✅ fuente única de labels

import ActionSlide from "./slides/ActionSlide";
import ConceptSlide from "./slides/ConceptSlide";
import ExampleSlide from "./slides/ExampleSlide";
import HookSlide from "./slides/HookSlide";
import QuizSlide from "./slides/QuizSlide";
import type { Slide } from "./types";

interface Props {
  slide: Slide;
  slideIndex: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  category: ContentCategory; // "environment" | "fitness" | ...
}

export default function SlideRenderer({
  slide,
  slideIndex,
  total,
  onBack,
  onNext,
  category,
}: Props) {
  const theme: CategoryTheme = useMemo(() => getCategoryTheme(category), [category]);

  // ✅ Convierte id -> label humano
  const categoryLabel = CATEGORY_LABEL[category] ?? "Rutina";

  switch (slide.type) {
    case "hook":
      return (
        <HookSlide
          data={slide}
          slideIndex={slideIndex}
          total={total}
          onBack={onBack}
          onNext={onNext}
          categoryLabel={categoryLabel}
          theme={theme}
        />
      );

    case "concept":
      return (
        <ConceptSlide
          data={slide}
          slideIndex={slideIndex}
          total={total}
          onBack={onBack}
          onNext={onNext}
          theme={theme}
        />
      );

    case "example":
      return (
        <ExampleSlide
          data={slide}
          slideIndex={slideIndex}
          total={total}
          onBack={onBack}
          onNext={onNext}
          theme={theme}
        />
      );

    case "action":
      return (
        <ActionSlide
          data={slide}
          slideIndex={slideIndex}
          total={total}
          onBack={onBack}
          onNext={onNext}
          theme={theme}
        />
      );

    case "quiz":
      return (
        <QuizSlide
          data={slide}
          slideIndex={slideIndex}
          total={total}
          onBack={onBack}
          onNext={onNext}
          theme={theme}
        />
      );

    default:
      return null;
  }
}

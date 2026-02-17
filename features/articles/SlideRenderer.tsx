import React from "react";
import { Slide } from "./types";

import HookSlide from "./slides/HookSlide";
import ConceptSlide from "./slides/ConceptSlide";
import ExampleSlide from "./slides/ExampleSlide";
import ActionSlide from "./slides/ActionSlide";
import QuizSlide from "./slides/QuizSlide";

type Category = "environment" | "fitness";

interface Props {
  slide: Slide;
  slideIndex: number; // índice real de esta slide
  total: number;
  onBack: () => void;
  onNext: () => void;
  category: Category;
}

export default function SlideRenderer({
  slide,
  slideIndex,
  total,
  onBack,
  onNext,
  category,
}: Props) {
  const categoryLabel =
    category === "environment" ? "Medio Ambiente" : "Actividad Física";

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
        />
      );

    default:
      return null;
  }
}

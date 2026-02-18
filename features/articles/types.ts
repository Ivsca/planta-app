// features/articles/types.ts
import type React from "react";
import type { ImageSourcePropType } from "react-native";
import type { MaterialIcons } from "@expo/vector-icons";
import type { CategoryId } from "@/features/content/category";

/**
 * ✅ Mantén un solo sistema de slides (hook/concept/example/action/quiz)
 * ✅ CategoryId viene del dominio (IDs internos estables)
 */

export type SlideType = "hook" | "concept" | "example" | "action" | "quiz";

export interface BaseSlide {
  id: string;
  type: SlideType;
}

export interface HookSlide extends BaseSlide {
  type: "hook";
  title: string;
  subtitle: string;

  /**
   * Hero opcional: o local (heroImage) o remoto (heroUri).
   * No hagas ambos obligatorios para evitar errores de assets en Expo.
   */
  heroUri?: string;
  heroImage?: ImageSourcePropType;
}

export type MaterialIconName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

export interface ConceptBullet {
  /**
   * Icono opcional por bullet (MaterialIcons).
   * Si no se define, tu UI debería mostrar uno por defecto.
   */
  icon?: MaterialIconName;
  title: string;
  body: string;
}

export interface ConceptSlide extends BaseSlide {
  type: "concept";
  title: string;
  subtitle?: string;
  bullets: ConceptBullet[];
}

export interface ExampleSlide extends BaseSlide {
  type: "example";
  title: string;
  before: string;
  after: string;

  /**
   * Visual opcional: local o remoto.
   * Deja que la UI decida prioridad (por ejemplo: local > remoto).
   */
  beforeImage?: ImageSourcePropType;
  afterImage?: ImageSourcePropType;

  beforeUri?: string;
  afterUri?: string;
}

export interface ActionSlide extends BaseSlide {
  type: "action";
  title: string;
  actions: string[];
}

export type QuizOption = {
  title: string;
  detail?: string;
};

export type QuizQuestion = {
  prompt: string;
  options: QuizOption[];
  correctIndex: number; // 0..options.length-1
  explanation: string;
};

export interface QuizSlide extends BaseSlide {
  type: "quiz";
  title: string;
  questions: QuizQuestion[];
}

export type Slide =
  | HookSlide
  | ConceptSlide
  | ExampleSlide
  | ActionSlide
  | QuizSlide;

export interface Article {
  id: string;
  category: CategoryId;
  title: string;
  slides: Slide[];
}

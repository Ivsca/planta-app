import { ImageSourcePropType } from "react-native";
export type SlideType = "hook" | "concept" | "example" | "action" | "quiz";

export interface BaseSlide {
  id: string;
  type: SlideType;
}

export interface HookSlide extends BaseSlide {
  type: "hook";
  title: string;
  subtitle: string;
  heroUri?: string; // opcional
  heroImage?: ImageSourcePropType;
}

export interface ConceptBullet {
  icon?: "walk" | "eco" | "park" | "info"; // enum simple para mapear a MaterialIcons
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

  // ✅ opcional: assets locales
  beforeImage?: ImageSourcePropType;
  afterImage?: ImageSourcePropType;

  // ✅ opcional: urls remotas
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
  correctIndex: number;
  explanation: string;
};

export interface QuizSlide {
  id: string;
  type: "quiz";
  title: string;
  questions: QuizQuestion[];
}


export type Slide = HookSlide | ConceptSlide | ExampleSlide | ActionSlide | QuizSlide;

export interface Article {
  id: string;
  category: "environment" | "fitness";
  title: string;
  slides: Slide[];
}

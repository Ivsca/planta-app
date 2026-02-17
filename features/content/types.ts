// features/content/types.ts
import type { ImageSourcePropType } from "react-native";

export type ContentCategory =
  | "Actividad física"
  | "Medio ambiente"
  | "Bienestar"
  | "Comunidad";

export type ContentType = "video" | "article" | "routine" | "challenge";

export type ContentBase = {
  id: string;
  title: string;
  category: ContentCategory;
  type: ContentType;

  description?: string;
  durationSec?: number;
  views?: number;
  isNew?: boolean;
 thumbnail?: ImageSourcePropType | { uri: string };
  createdAtISO?: string;
};

export type ArticleSlide =
  | { kind: "cover"; title: string; subtitle?: string; image?: ImageSourcePropType | { uri: string } }
  | { kind: "text"; title?: string; body: string }
  | { kind: "bullets"; title?: string; items: string[] }
  | { kind: "quiz"; question: string; options: string[]; correctIndex: number };

export type ArticleItem = ContentBase & {
  type: "article";
  slides: ArticleSlide[];
  sources?: { label: string; url?: string }[]; // opcional, por si luego quieres mostrar “Fuentes”
};

export type VideoItem = ContentBase & {
  type: "video";
  videoUrl: string; // o asset local / id de YouTube, etc.
};

export type RoutineItem = ContentBase & {
  type: "routine";
  // define lo mínimo que tu UI necesita
};

export type ChallengeItem = ContentBase & {
  type: "challenge";
  // define lo mínimo
};

export type ContentItem = ArticleItem | VideoItem | RoutineItem | ChallengeItem;

export type DiscoverChip = {
  id: "Todo" | ContentCategory;
  label: string;
};

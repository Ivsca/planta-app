// features/content/types.ts
export type ContentCategory =
  | "Actividad física"
  | "Medio ambiente"
  | "Bienestar"
  | "Comunidad";

export type ContentType = "video" | "article" | "routine" | "challenge";

export type ContentItem = {
  id: string;
  title: string;
  category: ContentCategory;
  type: ContentType;
  durationSec?: number;
  views?: number;
  isNew?: boolean;
  thumbnail?: string;
  createdAtISO?: string;
};

export type DiscoverChip = {
  id: "Todo" | ContentCategory;
  label: string;
};

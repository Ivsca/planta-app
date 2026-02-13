
import type { ContentCategory } from "./types";

export const CATEGORY_COLORS: Record<
  ContentCategory,
  { base: string; soft: string }
> = {
  "Actividad física": {
    base: "#4CC9F0",
    soft: "rgba(76,201,240,0.15)",
  },
  "Medio ambiente": {
    base: "#43AA8B",
    soft: "rgba(67,170,139,0.15)",
  },
  "Bienestar": {
    base: "#e619e5",
    soft: "rgba(230,25,229,0.15)",
  },
  "Comunidad": {
    base: "#3A86FF",
    soft: "rgba(58,134,255,0.15)",
  },
};

export function getCategoryColor(cat: ContentCategory) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS["Bienestar"];
}

// features/articles/categoryTheme.ts

import type { CategoryId } from "@/features/content/category"; 
// si no tienes alias, usa ruta relativa correcta

export type CategoryTheme = {
  base: string;
  soft: string;
  border: string;
};

export const CATEGORY_THEME: Record<CategoryId, CategoryTheme> = {
  environment: {
    base: "#43AA8B",
    soft: "rgba(67,170,139,0.12)",
    border: "rgba(67,170,139,0.30)",
  },
  fitness: {
    base: "#4CC9F0",
    soft: "rgba(76,201,240,0.12)",
    border: "rgba(76,201,240,0.30)",
  },
  routine: {
    base: "#e619e5",
    soft: "rgba(230,25,229,0.12)",
    border: "rgba(230,25,229,0.30)",
  },
  challenges: {
    base: "#3A86FF",
    soft: "rgba(58,134,255,0.12)",
    border: "rgba(58,134,255,0.30)",
  },
};

export function getCategoryTheme(category: CategoryId): CategoryTheme {
  return CATEGORY_THEME[category] ?? CATEGORY_THEME.routine;
}

// features/content/selectors.ts
import type { ContentItem, ContentCategory } from "./types";

export function formatDuration(durationSec?: number) {
  if (durationSec == null || durationSec <= 0) return "";
  const m = Math.floor(durationSec / 60);
  const s = durationSec % 60;
  const ss = s.toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export function formatViews(views?: number) {
  // ✅ 0 es un valor válido (no lo trates como falsy)
  if (views == null) return "";
  if (views >= 1000) return `${(views / 1000).toFixed(1).replace(".0", "")}k`;
  return `${views}`;
}

export function applyDiscoverFilters(params: {
  items: ContentItem[];
  query: string;
  chip: "Todo" | ContentCategory; // ✅ esto es solo filtro por categoría
}) {
  const q = params.query.trim().toLowerCase();

  let out = params.items;

  // Filtro por categoría (tema)
  if (params.chip !== "Todo") {
    out = out.filter((it) => it.category === params.chip);
  }

  // Filtro por query
  if (q) {
    out = out.filter((it) => it.title.toLowerCase().includes(q));
  }

  return out;
}
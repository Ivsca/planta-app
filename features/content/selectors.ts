import { ContentItem, ContentCategory } from "./types";

export function formatDuration(durationSec?: number) {
  if (!durationSec || durationSec <= 0) return "";
  const m = Math.floor(durationSec / 60);
  const s = durationSec % 60;
  const ss = s.toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export function formatViews(views?: number) {
  if (!views) return "";
  if (views >= 1000) return `${(views / 1000).toFixed(1).replace(".0", "")}k`;
  return `${views}`;
}

export function applyDiscoverFilters(params: {
  items: ContentItem[];
  query: string;
  chip: "Todo" | ContentCategory;
}) {
  const q = params.query.trim().toLowerCase();
  return params.items
    .filter((it) => (params.chip === "Todo" ? true : it.category === params.chip))
    .filter((it) => (q ? it.title.toLowerCase().includes(q) : true));
}

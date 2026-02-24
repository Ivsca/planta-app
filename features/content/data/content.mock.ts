// features/content/data/content.mock.ts
import { getAllMockArticles } from "../../../features/articles/article.store.mock";
import type { Article, HookSlide } from "../../../features/articles/types";
import type { ContentItem } from "../types";

function getArticleThumbnail(article: Article): NonNullable<ContentItem["thumbnail"]> {
  const hook = article.slides.find((s) => s.type === "hook") as HookSlide | undefined;

  if (hook?.heroImage) return hook.heroImage;
  if (hook?.heroUri) return { uri: hook.heroUri };

  return require("../../../assets/images/cambio.jpg");
}

function articleToContentItem(article: Article): ContentItem {
  return {
    id: article.id,
    type: "article",
    title: article.title,
    category: article.category,
    slides: article.slides,
    views: 1200,
    isNew: true,
    thumbnail: getArticleThumbnail(article),
  };
}

const ARTICLE_ITEMS: ContentItem[] = getAllMockArticles().map(articleToContentItem);

/**
 * ✅ Podcasts NO son artículos.
 * Son ContentItem con type: "podcast", y con categoría temática (environment/fitness/routine/challenges).
 * Esto hace que el chip de "Podcast" funcione (filtra por type).
 */
const PODCAST_ITEMS: ContentItem[] = [
  {
    id: "podcast-001",
    type: "podcast",
    title: "Podcast: Empezar hábitos sin quemarte",
    category: "routine",
    description: "Episodio corto para crear consistencia sin perfeccionismo.",
    durationSec: 420,
    views: 320,
    isNew: true,
    thumbnail: require("../../../assets/images/cambio.jpg"),
    audioUrl: "https://example.com/podcast-001.mp3",
    showTitle: "Planta Podcast",
    episodeNumber: 1,
  },
  {
    id: "podcast-002",
    type: "podcast",
    title: "Podcast: Respiración y estrés en 5 minutos",
    category: "fitness",
    description: "Una pausa guiada para bajar revoluciones.",
    durationSec: 300,
    views: 210,
    isNew: false,
    thumbnail: require("../../../assets/images/cambio.jpg"),
    audioUrl: "https://example.com/podcast-002.mp3",
    showTitle: "Planta Podcast",
    episodeNumber: 2,
  },
];

// ✅ Feed combinado
export const FEED: ContentItem[] = [...PODCAST_ITEMS, ...ARTICLE_ITEMS];

// ✅ Featured: mezcla (primero podcasts, luego artículos) o cambia la lógica si prefieres
export const FEATURED: ContentItem[] = FEED.slice(0, 3);
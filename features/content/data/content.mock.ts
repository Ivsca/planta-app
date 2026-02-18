// features/content/data/content.mock.ts
import { getAllMockArticles } from "../../../features/articles/article.store.mock"; 
import type { Article, HookSlide } from "../../../features/articles/types";         
import type { ContentItem } from "../types";

function getArticleThumbnail(
  article: Article
): NonNullable<ContentItem["thumbnail"]> {
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

export const FEATURED: ContentItem[] = ARTICLE_ITEMS.slice(0, 3);
export const FEED: ContentItem[] = ARTICLE_ITEMS;

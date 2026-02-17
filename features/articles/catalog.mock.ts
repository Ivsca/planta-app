// features/articles/catalog.mock.ts
import { getAllMockArticles } from "./article.store.mock";

export type ArticleCard = {
  id: string;
  title: string;
  category: "environment" | "fitness";
  coverUri?: string;
};

export function getArticleCatalog(): ArticleCard[] {
  return getAllMockArticles().map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category,
  }));
}

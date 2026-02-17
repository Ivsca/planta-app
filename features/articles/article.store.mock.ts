// features/articles/article.store.mock.ts
import type { Article } from "./types";
import { ALL_MOCK_ARTICLES } from "./data";

const ALL: Article[] = ALL_MOCK_ARTICLES;

export function getMockArticleById(id: string): Article | undefined {
  return ALL.find((a) => a.id === id);
}

export function getAllMockArticles(): Article[] {
  return ALL;
}

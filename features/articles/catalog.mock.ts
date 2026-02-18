import { getAllMockArticles } from "./article.store.mock";
import type { CategoryId } from "@/features/content/category"; 

export type ArticleCard = {
  id: string;
  title: string;
  category: CategoryId; 
  coverUri?: string;
};

export function getArticleCatalog(): ArticleCard[] {
  return getAllMockArticles().map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category,
    
  }));
}

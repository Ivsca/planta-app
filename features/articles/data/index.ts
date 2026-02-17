// features/articles/data/index.ts
import type { Article } from "../types";
import { ENVIRONMENT_ARTICLES } from "./environment";


export const ALL_MOCK_ARTICLES: Article[] = [
  ...ENVIRONMENT_ARTICLES,
  
];

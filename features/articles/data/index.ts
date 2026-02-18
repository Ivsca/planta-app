// features/articles/data/index.ts
import type { Article } from "../types";
import { ENVIRONMENT_ARTICLES } from "./environment";
import { FITNESS_ARTICLES } from "./fitness";


export const ALL_MOCK_ARTICLES: Article[] = [
  ...ENVIRONMENT_ARTICLES,
  ...FITNESS_ARTICLES,
  
];

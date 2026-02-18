
import type { ImageSourcePropType } from "react-native";

import type { Slide } from "../articles/types";

export type ContentCategory =
  | "environment"
  | "fitness"
  | "routine"
  | "challenges";

export type ContentType = "video" | "article" | "routine" | "challenge";

export type ContentBase = {
  id: string;
  title: string;
  category: ContentCategory;
  type: ContentType;

  description?: string;
  durationSec?: number;
  views?: number;
  isNew?: boolean;

  thumbnail?: ImageSourcePropType | { uri: string };
  createdAtISO?: string;
};


export type ArticleItem = ContentBase & {
  type: "article";
  slides: Slide[];
  sources?: { label: string; url?: string }[];
};

export type VideoItem = ContentBase & {
  type: "video";
  videoUrl: string; 
};

export type RoutineItem = ContentBase & {
  type: "routine";
  
};

export type ChallengeItem = ContentBase & {
  type: "challenge";
  
};

export type ContentItem = ArticleItem | VideoItem | RoutineItem | ChallengeItem;


export type DiscoverChip = {
  id: "Todo" | ContentCategory;
  label: string;
};

// features/content/types.ts
import type { ImageSourcePropType } from "react-native";
import type { Slide } from "../articles/types";
import type { CategoryId } from "./category";

export type ContentCategory = CategoryId;

export type ContentType = "video" | "article" | "routine" | "challenge" | "podcast";

export type ContentBase = {
  id: string;
  title: string;
  category: ContentCategory;
  type: ContentType;

  description?: string;
  durationSec?: number;
  views?: number;
  isNew?: boolean;

  // ✅ ImageSourcePropType ya soporta require(...) y { uri: string }
  thumbnail?: ImageSourcePropType;
  createdAtISO?: string;
};

export type PodcastItem = ContentBase & {
  type: "podcast";
  audioUrl: string; // idealmente https
  showTitle?: string;
  episodeNumber?: number;
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

export type RoutineItem = ContentBase & { type: "routine" };
export type ChallengeItem = ContentBase & { type: "challenge" };

export type ContentItem =
  | ArticleItem
  | VideoItem
  | RoutineItem
  | ChallengeItem
  | PodcastItem;

/**
 * Optional: chip model if you later want to unify "chips" in one type.
 * Right now DiscoverScreen uses UiTypeChip locally, so you can delete this if unused.
 */
export type DiscoverChip =
  | { kind: "all"; id: "Todo"; label: string }
  | { kind: "category"; id: ContentCategory; label: string }
  | { kind: "type"; id: ContentType; label: string };
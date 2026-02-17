// app/content/[id].tsx
import { useEffect, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { FEED, FEATURED } from "@/features/content/data/content.mock";
import type { ContentItem } from "@/features/content/types";

export default function ContentDispatcher() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const idParam = params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  const item = useMemo<ContentItem | undefined>(() => {
    if (!id) return undefined;
    const all = [...FEATURED, ...FEED];
    return all.find((x) => x.id === id);
  }, [id]);

  useEffect(() => {
    if (!item) return;

    switch (item.type) {
      case "article":
        router.replace(`/articles/${item.id}`);
        break;

      case "video":
        router.replace(`/video/${item.id}`);
        break;

      case "routine":
        router.replace(`/routines/${item.id}`);
        break;

      case "challenge":
        router.replace(`/challenges/${item.id}`);
        break;

      default:
        break;
    }
  }, [item, router]);

  // Pantalla neutra mientras redirige
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0F",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#13EC5B" />
    </View>
  );
}

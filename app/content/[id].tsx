// app/content/[id].tsx
import { useEffect, useMemo } from "react";
import { View, ActivityIndicator, Text, Pressable } from "react-native";
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
    // ⚠️ Evita duplicados (FEATURED suele ser subset de FEED).
    // Igual no rompe, pero mejor construir una sola vez.
    const all = [...FEATURED, ...FEED];
    return all.find((x) => x.id === id);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // ✅ Si no existe, no te quedes cargando infinito
    if (!item) return;

    switch (item.type) {
      case "article":
        router.replace(`/articles/${item.id}`);
        return;

      case "video":
        router.replace(`/video/${item.id}`);
        return;

      case "routine":
        router.replace(`/routines/${item.id}`);
        return;

      case "challenge":
        router.replace(`/challenges/${item.id}`);
        return;

      case "podcast":
        router.replace(`/podcasts/${item.id}`);
        return;

      default:
        return;
    }
  }, [id, item, router]);

  // ✅ Si id es inválido o el item no existe, muestra fallback usable
  if (id && !item) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0B0F",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
          Contenido no encontrado
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.60)",
            marginTop: 8,
            textAlign: "center",
            fontSize: 13,
            fontWeight: "600",
            lineHeight: 18,
          }}
        >
          El contenido con id “{id}” no existe o fue removido.
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)/discover")}
          style={{
            marginTop: 16,
            backgroundColor: "#13EC5B",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 12,
          }}
          accessibilityRole="button"
        >
          <Text style={{ color: "#000", fontWeight: "900" }}>
            Volver a Descubrir
          </Text>
        </Pressable>
      </View>
    );
  }

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
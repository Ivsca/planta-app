// app/articles/[id].tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, FlatList, useWindowDimensions, ListRenderItem, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getMockArticleById } from "@/features/articles/article.store.mock";
import SlideRenderer from "@/features/articles/SlideRenderer";
import type { Slide } from "@/features/articles/types";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);

  // 🔎 Buscar artículo real por ID
  const article = useMemo(() => {
    if (!id) return undefined;
    return getMockArticleById(String(id));
  }, [id]);

  const [activeIndex, setActiveIndex] = useState(0);

  // 🚨 Manejo correcto si no existe
  if (!article) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0B0F",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
          Artículo no encontrado
        </Text>
      </View>
    );
  }

  const total = article.slides.length;

  const clampIndex = (i: number) =>
    Math.max(0, Math.min(total - 1, i));

  const goTo = useCallback(
    (nextIndex: number) => {
      const target = clampIndex(nextIndex);
      listRef.current?.scrollToIndex({ index: target, animated: true });
      setActiveIndex(target);
    },
    [total]
  );

  const onBack = useCallback(() => {
    if (activeIndex > 0) return goTo(activeIndex - 1);
    router.back();
  }, [activeIndex, goTo, router]);

  const onNext = useCallback(() => {
    if (activeIndex < total - 1) return goTo(activeIndex + 1);

    // 🔥 Fin del artículo
    // Aquí luego puedes:
    // - sumar energía
    // - marcar progreso
    // - mostrar pantalla de éxito
    router.back();
  }, [activeIndex, total, goTo, router]);

  const renderItem: ListRenderItem<Slide> = ({ item, index }) => (
    <View style={{ width }}>
      <SlideRenderer
        slide={item}
        slideIndex={index}
        activeIndex={activeIndex}
        total={total}
        onBack={onBack}
        onNext={onNext}
        category={article.category}
        articleTitle={article.title}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0F" }}>
      <FlatList
        ref={listRef}
        data={article.slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setActiveIndex(clampIndex(newIndex));
        }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

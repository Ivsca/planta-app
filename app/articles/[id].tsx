// app/articles/[id].tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  FlatList,
  useWindowDimensions,
  type ListRenderItem,
  Text,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getMockArticleById } from "../../features/articles/article.store.mock";
import SlideRenderer from "../../features/articles/SlideRenderer";
import type { Slide } from "../../features/articles/types";

export default function ArticleScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();

  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);

  const id = useMemo(() => {
    const raw = params?.id;
    if (!raw) return undefined;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params?.id]);

  const article = useMemo(() => {
    if (!id) return undefined;
    return getMockArticleById(String(id));
  }, [id]);

  const [activeIndex, setActiveIndex] = useState(0);

  const total = article?.slides.length ?? 0;

 
  const clampIndex = useCallback(
    (i: number) => {
      if (total <= 0) return 0;
      return Math.max(0, Math.min(total - 1, i));
    },
    [total]
  );

  const goTo = useCallback(
    (nextIndex: number) => {
      const target = clampIndex(nextIndex);
      listRef.current?.scrollToIndex({ index: target, animated: true });
      setActiveIndex(target);
    },
    [clampIndex]
  );

  const onBack = useCallback(() => {
    if (activeIndex > 0) return goTo(activeIndex - 1);
    router.back();
  }, [activeIndex, goTo, router]);

  const onNext = useCallback(() => {
    if (total > 0 && activeIndex < total - 1) return goTo(activeIndex + 1);
    router.back();
  }, [activeIndex, total, goTo, router]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (total <= 0) return;
      const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
      setActiveIndex(clampIndex(newIndex));
    },
    [width, total, clampIndex]
  );

  const renderItem: ListRenderItem<Slide> = useCallback(
    ({ item, index }) => {
      if (!article) return null; 
      return (
        <View style={{ width }}>
          <SlideRenderer
            slide={item}
            slideIndex={index}
            total={total}
            onBack={onBack}
            onNext={onNext}
            category={article.category}
          />
        </View>
      );
    },
    [article, width, total, onBack, onNext]
  );


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
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

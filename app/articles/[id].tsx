// app/articles/[id].tsx
import React, { useEffect, useCallback, useMemo, useRef, useState } from "react";
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
import { useAuth } from "@/context/AuthContext";

const API_BASE = "http://10.7.64.107:5000/api";

export default function ArticleScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();

  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);

  const { token } = useAuth();

  const id = useMemo(() => {
    const raw = params?.id;
    if (!raw) return undefined;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params?.id]);

  const article = useMemo(() => {
    if (!id) return undefined;
    return getMockArticleById(String(id));
  }, [id]);

  const total = article?.slides.length ?? 0;

  const [activeIndex, setActiveIndex] = useState(0);

  // Control para evitar que el PATCH in-progress se dispare antes de cargar el índice guardado
  const [initialIndexLoaded, setInitialIndexLoaded] = useState(false);

  // 1) Al cambiar de artículo, carga el índice guardado y scrollea ahí
  useEffect(() => {
    setInitialIndexLoaded(false);
    setActiveIndex(0);

    if (!token || !id) {
      // sin token, arranca en 0 como fallback
      requestAnimationFrame(() => {
        try {
          listRef.current?.scrollToIndex({ index: 0, animated: false });
        } catch {}
      });
      setInitialIndexLoaded(true);
      return;
    }

    let alive = true;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/activity/article/${String(id)}/in-progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const json = await res.json();

        if (!alive) return;

        const idxRaw = Number(json?.lastSeenIndex ?? 0);
        const idx = Number.isFinite(idxRaw) ? idxRaw : 0;
        const safe = Math.max(0, Math.min((total > 0 ? total - 1 : 0), idx));

        setActiveIndex(safe);

        requestAnimationFrame(() => {
          try {
            listRef.current?.scrollToIndex({ index: safe, animated: false });
          } catch {
            // si FlatList aún no midió, reintenta
            requestAnimationFrame(() => {
              try {
                listRef.current?.scrollToIndex({ index: safe, animated: false });
              } catch {}
            });
          }
        });
      } catch {
        // fallback silencioso
        requestAnimationFrame(() => {
          try {
            listRef.current?.scrollToIndex({ index: 0, animated: false });
          } catch {}
        });
        setActiveIndex(0);
      } finally {
        if (alive) setInitialIndexLoaded(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, token, total]);

  // 2) Registro automático (started) - una vez por artículo
  useEffect(() => {
    if (!token || !id) return;

    fetch(`${API_BASE}/activity/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "article_started",
        refType: "article",
        refId: String(id),
      }),
    }).catch(() => {});
  }, [token, id]);

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

      setActiveIndex((prev) => (prev === target ? prev : target));

      try {
        listRef.current?.scrollToIndex({ index: target, animated: true });
      } catch {
        requestAnimationFrame(() => {
          try {
            listRef.current?.scrollToIndex({ index: target, animated: true });
          } catch {}
        });
      }
    },
    [clampIndex]
  );

  const markCompleted = useCallback(async () => {
    if (!token || !id) return;
    try {
      await fetch(`${API_BASE}/activity/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "article_completed",
          refType: "article",
          refId: String(id),
        }),
      });
    } catch {}
  }, [token, id]);

  const onBack = useCallback(() => {
    if (activeIndex > 0) return goTo(activeIndex - 1);
    router.back();
  }, [activeIndex, goTo, router]);

  const onNext = useCallback(() => {
    if (total > 0 && activeIndex < total - 1) {
      return goTo(activeIndex + 1);
    }
    void markCompleted();
    router.back();
  }, [activeIndex, total, goTo, router, markCompleted]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (total <= 0) return;
      const newIndex = clampIndex(
        Math.round(e.nativeEvent.contentOffset.x / width)
      );
      setActiveIndex((prev) => (prev === newIndex ? prev : newIndex));
    },
    [width, total, clampIndex]
  );

  // 3) Activity: in-progress (debounce) - solo después de cargar el índice inicial
  useEffect(() => {
    if (!token || !id) return;
    if (!initialIndexLoaded) return;

    const t = setTimeout(() => {
      fetch(`${API_BASE}/activity/in-progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          refType: "article",
          refId: String(id),
          payload: { slideIndex: activeIndex },
        }),
      }).catch(() => {});
    }, 400);

    return () => clearTimeout(t);
  }, [token, id, activeIndex, initialIndexLoaded]);

  const renderItem: ListRenderItem<Slide> = useCallback(
    ({ item }) => {
      if (!article) return null;

      return (
        <View style={{ width }}>
          <SlideRenderer
            slide={item}
            slideIndex={activeIndex}
            total={total}
            onBack={onBack}
            onNext={onNext}
            category={article.category}
          />
        </View>
      );
    },
    [article, width, activeIndex, total, onBack, onNext]
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
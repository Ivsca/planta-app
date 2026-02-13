import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { ContentCategory, ContentItem } from "../types";
import { DISCOVER_CHIPS, FEATURED, FEED } from "../data/content.mock";
import { applyDiscoverFilters } from "../selectors";
import { SearchBar } from "../components/SearchBar";
import { FilterChips } from "../components/FilterChips";
import { FeaturedCarousel } from "../components/FeaturedCarousel";
import { QuickActions } from "../components/QuickActions";
import { QuickRoutineBanner } from "../components/QuickRoutineBanner";
import { ContentRowItem } from "../components/ContentRowItem";

/**
 * Mapeo: id del QuickAction -> chip/categoría.
 * Importante: estos IDs deben coincidir con los que definiste en QuickActions.tsx
 */
const QUICK_ACTION_TO_CHIP: Record<string, "Todo" | ContentCategory> = {
  programas: "Bienestar",
  cortos: "Actividad física",
  retos: "Comunidad",
  habitos: "Medio ambiente",
};

export default function DiscoverScreen() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<"Todo" | ContentCategory>("Todo");

  const listRef = useRef<FlatList<ContentItem>>(null);

  const filtered = useMemo(
    () => applyDiscoverFilters({ items: FEED, query, chip }),
    [query, chip]
  );

  const handleQuickActionPress = (id: string) => {
    const nextChip = QUICK_ACTION_TO_CHIP[id];
    if (!nextChip) return;

    // Cambia filtro y limpia búsqueda para que el usuario note el cambio
    setChip(nextChip);
    setQuery("");

    // Sube al inicio para que se sienta "intencional"
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.h1}>Descubrir</Text>
        <Pressable style={styles.notifBtn} hitSlop={10}>
          <MaterialIcons name="notifications" size={20} color="white" />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      <FlatList<ContentItem>
        ref={listRef}
        data={filtered}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={{ gap: 18 }}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onPressFilters={() => {}}
            />

            <FilterChips
              chips={DISCOVER_CHIPS}
              active={chip}
              onChange={(next) => {
                setChip(next);
                // opcional: cuando cambias chip manual, no borres query.
                // si quieres que siempre borre, descomenta:
                // setQuery("");
              }}
            />

            <FeaturedCarousel title="Para ti" items={FEATURED} onPressAll={() => {}} />

            <QuickActions onPress={handleQuickActionPress} />

            <QuickRoutineBanner onPress={() => {}} />

            <Text style={styles.sectionTitle}>Explorar</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => <ContentRowItem item={item} onPress={() => {}} />}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </View>
  );
}

const TOKENS = {
  bg: "#0A0A0A",
  surface: "#161616",
  border: "rgba(255,255,255,0.10)",
  primary: "#e619e5",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: TOKENS.bg },
  topBar: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  h1: { color: "white", fontSize: 22, fontWeight: "900" },
  notifBtn: {
    height: 40,
    width: 40,
    borderRadius: 999,
    backgroundColor: TOKENS.surface,
    borderWidth: 1,
    borderColor: TOKENS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: TOKENS.primary,
    borderWidth: 2,
    borderColor: TOKENS.bg,
  },
  listContent: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 22 },
  sectionTitle: { color: "white", fontSize: 18, fontWeight: "900" },
});

import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import type { ContentCategory, ContentItem } from "../types";
import { FEATURED, FEED } from "../data/content.mock";
import { applyDiscoverFilters } from "../selectors";
import { Stitch } from "../../../constants/theme";

type UiChip = "Todo" | "Ambiente" | "Ejercicio" | "Bienestar";

/**
 * Stitch usa chips: Todo / Ambiente / Ejercicio / Bienestar
 * Tu dominio usa categorías: "Medio ambiente" / "Actividad física" / "Bienestar" / "Comunidad"
 * Mapeo para que los filtros funcionen con tu selector actual.
 */
const UI_TO_DOMAIN_CHIP: Record<UiChip, "Todo" | ContentCategory> = {
  Todo: "Todo",
  Ambiente: "Medio ambiente",
  Ejercicio: "Actividad física",
  Bienestar: "Bienestar",
};

const DOMAIN_TO_UI_LABEL: Partial<Record<ContentCategory, UiChip>> = {
  "Medio ambiente": "Ambiente",
  "Actividad física": "Ejercicio",
  Bienestar: "Bienestar",
};

function getItemImage(item: any): string | undefined {
  return (
    item?.image ??
    item?.thumbnail ??
    item?.cover ??
    item?.img ??
    item?.hero ??
    undefined
  );
}

function getItemTitle(item: any): string {
  return item?.title ?? item?.name ?? "Contenido";
}

function getItemCategory(item: any): ContentCategory | undefined {
  return item?.category ?? item?.chip ?? item?.tag ?? undefined;
}

function getItemDuration(item: any): string | undefined {
  // Acepta "12:40", "12 min", etc.
  return item?.duration ?? item?.time ?? item?.length ?? undefined;
}

export default function DiscoverScreen() {
  const [query, setQuery] = useState("");
  const [uiChip, setUiChip] = useState<UiChip>("Todo");
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const listRef = useRef<FlatList<ContentItem>>(null);

  const domainChip = UI_TO_DOMAIN_CHIP[uiChip];

  const filtered = useMemo(
    () => applyDiscoverFilters({ items: FEED, query, chip: domainChip }),
    [query, domainChip]
  );

  const toggleSave = (id: string) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.screen}>
      {/* Header sticky (simulado): lo ponemos fuera del FlatList para que quede fijo */}
      <View style={styles.stickyHeader}>
        {/* Blur de fondo */}
        <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.stickyOverlay} />

        <View style={styles.headerRow}>
          <Text style={styles.h1}>Descubrir</Text>
          <Pressable style={styles.notifBtn} hitSlop={10}>
            <MaterialIcons name="notifications" size={20} color={Stitch.colors.primary} />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <MaterialIcons name="search" size={20} color="rgba(255,255,255,0.45)" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar videos, tips, rutinas..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Chips horizontales */}
      <ScrollView
        horizontal
        style={styles.chipsScroll}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {(["Todo", "Ambiente", "Ejercicio", "Bienestar"] as UiChip[]).map((c) => {
          const active = c === uiChip;
          return (
            <Pressable
              key={c}
              onPress={() => {
                setUiChip(c);
                // UX Stitch: el chip cambia la lista
                requestAnimationFrame(() =>
                  listRef.current?.scrollToOffset({ offset: 0, animated: true })
                );
              }}
              style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
            >
              <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                {c}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList<ContentItem>
        ref={listRef}
        data={filtered}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Featured carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={false}
              snapToAlignment="center"
              decelerationRate="fast"
              contentContainerStyle={styles.featuredRow}
            >
              {FEATURED.map((item: any, idx: number) => {
                const uri = getItemImage(item);
                const title = getItemTitle(item);
                const meta = item?.meta ?? item?.subtitle ?? "—";
                const badge = item?.badge ?? (idx === 0 ? "Destacado" : "Nuevo");

                return (
                  <Pressable key={item?.id ?? String(idx)} style={styles.featuredCard}>
                    {uri ? <Image source={{ uri }} style={styles.featuredImg} /> : null}

                    <LinearGradient
                      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.80)"]}
                      style={StyleSheet.absoluteFill}
                    />

                    <View style={styles.featuredContent}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{badge}</Text>
                      </View>
                      <Text style={styles.featuredTitle} numberOfLines={2}>
                        {title}
                      </Text>
                      <Text style={styles.featuredMeta} numberOfLines={1}>
                        {meta}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Section header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recomendado para ti</Text>
              <Pressable>
                <Text style={styles.sectionLink}>Ver todo</Text>
              </Pressable>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        renderItem={({ item }: { item: any }) => {
          const uri = getItemImage(item);
          const title = getItemTitle(item);
          const duration = getItemDuration(item);
          const category = getItemCategory(item);
          const uiLabel =
            (category && DOMAIN_TO_UI_LABEL[category]) || "Todo";

          const isSaved = !!saved[item.id];

          return (
            <Pressable style={styles.row}>
              <View style={styles.thumbWrap}>
                {uri ? <Image source={{ uri }} style={styles.thumb} /> : null}
                {duration ? (
                  <View style={styles.durationPill}>
                    <Text style={styles.durationText}>{duration}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.rowBody}>
                <Text style={styles.kicker}>{uiLabel}</Text>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {title}
                </Text>

                <Pressable
                  onPress={() => toggleSave(item.id)}
                  style={styles.saveBtn}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name={isSaved ? "bookmark" : "bookmark-border"}
                    size={18}
                    color={isSaved ? Stitch.colors.primary : "rgba(255,255,255,0.50)"}
                  />
                  <Text
                    style={[
                      styles.saveText,
                      isSaved && { color: Stitch.colors.primary },
                    ]}
                  >
                    Guardar
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          );
        }}
        ListFooterComponent={<View style={{ height: 24 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Stitch.colors.bg,
  },

  stickyHeader: {
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Stitch.colors.divider,
    overflow: "hidden",
  },
  stickyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 12,
  },
  h1: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  chipsRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    alignItems: "center",     
  },

  chipsScroll: {
    maxHeight: 56,
  },
  chip: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: Stitch.colors.primary,
  },
  chipInactive: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  chipText: {
    fontSize: 14,
    lineHeight: 18,
    textAlignVertical: "center",
    includeFontPadding: false as any,
  },
  chipTextActive: {
    color: "#000",
    fontWeight: "800",
  },
  chipTextInactive: {
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
  },

  listContent: {
    paddingBottom: 20,
  },

  featuredRow: {
    paddingHorizontal: 16,
    gap: 14,
  },
  featuredCard: {
    width: 320, // ~85% en móviles comunes; ajusta si quieres
    height: 180,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  featuredImg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  featuredContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: Stitch.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  badgeText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 24,
  },
  featuredMeta: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  sectionLink: {
    color: Stitch.colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  row: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 16,
  },
  thumbWrap: {
    width: 128,
    height: 80,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  thumb: { width: "100%", height: "100%" },
  durationPill: {
    position: "absolute",
    right: 6,
    bottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.70)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  durationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },

  rowBody: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  kicker: {
    color: Stitch.colors.primary,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  rowTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 3,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  saveText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "700",
  },
});

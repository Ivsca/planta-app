import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

type VideoCard = {
  id: string;
  title: string;
  meta: string;
  duration: string;
  imageUrl: string;
  alt: string;
};

const VIDEOS: VideoCard[] = [
  {
    id: "1",
    title: "Yoga para la ansiedad nocturna",
    meta: "Bienestar • 2.4k vistas",
    duration: "12:40",
    alt: "Yoga nocturno",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqOyFiYAp1HsOFeFU3zUDmCh2QNgnT0ZXxbwhEc-FjqmEc5H-vfB1tabh9dan1qcVj6zJ1p8oYlh2bmJUtjEHYjwwpyT4KPCZTxzpgqaE6BTJARvvTAhHZlhqeVtLcK1PABUqpxe7BMCCcrEMP4WDgp5cBSFRwLx1Um--51etb1meuFjdIuIw8bHx4vnM04tcWyoZ7Jw-pGJJSxJjT_dXn9nm-0PxHfac7L1glu1F24sQkQiNv_gWiHuIl9uaaRVq7e8a77j9yKUq2",
  },
  {
    id: "2",
    title: "Hacer compost en casa: Guía rápida",
    meta: "Medio ambiente • 1.8k vistas",
    duration: "05:15",
    alt: "Compostaje",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD75l5q32hpPycA6JuXZzs5mQUsmixYHr0qOWh-hBaO_w_TR5AQ5D1LTd1_Zb2pTdf8t87SXRO-7YNc5o2ykMoY9BNLUbs3vNQQ4m3sFh0lXzZe5i8AqecZxr7_zMkQ45eOKHS5MTjSe88GfFU3GOtPM_i_bwomUAkYcMUXsU5g_-h6VbH7VeGU57BbSe8BD9raiibkq2tUAxgNd48KHLTa6jOqpePCsG0d9JRUFC4ze8ftN4vvKdETpjWNrdHVyRLsNaXPOvHpK73O",
  },
];

const START_HERE = [
  { id: "p1", icon: "auto-awesome-motion", label: "Programas guiados" as const },
  { id: "p2", icon: "play-circle-outline", label: "Videos cortos" as const },
  { id: "p3", icon: "stars", label: "Recomendado para hoy" as const },
];

const CATEGORIES = [
  { id: "c1", icon: "fitness-center", label: "Actividad física", border: "cyan" as const },
  { id: "c2", icon: "eco", label: "Medio ambiente", border: "green" as const },
  { id: "c3", icon: "self-improvement", label: "Bienestar", border: "violet" as const },
  { id: "c4", icon: "groups", label: "Comunidad", border: "blue" as const },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const screenW = Dimensions.get("window").width;

  // Mimic “max-w-[430px]” centered shell (para tablets/desktop RN/web)
  const shellW = Math.min(430, screenW);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={[styles.shell, { width: shellW }]}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            // Espacio real para que nada quede debajo del TabBar
            { paddingBottom: tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.logoCircle} accessible accessibilityLabel="Logo Planta de Transformación">
              <MaterialIcons name="filter-vintage" size={36} color={TOKENS.primary} />
            </View>

            <Text style={styles.h1} accessibilityRole="header">
              Planta de Transformación
            </Text>

            <Text style={styles.subtitle}>Pequeños hábitos, gran cambio</Text>
          </View>

          {/* QUICK ROUTINE */}
          <View style={styles.sectionPad}>
            <SecondaryCyanButton
              icon="bolt"
              label="Rutina rápida (5 min)"
              onPress={() => {
                // TODO: abrir rutina rápida
              }}
            />
          </View>

          {/* DESTACADOS */}
          <SectionHeader title="Destacados" actionLabel="Ver todo" onActionPress={() => {}} />

          <HorizontalRail contentPadding={TOKENS.px}>
            {VIDEOS.map((v) => (
              <VideoCardItem key={v.id} card={v} />
            ))}
          </HorizontalRail>

          {/* START HERE */}
          <SectionTitleOnly title="Empieza por aquí" />

          <HorizontalRail contentPadding={TOKENS.px}>
            {START_HERE.map((item) => (
              <StartHereCard key={item.id} icon={item.icon} label={item.label} />
            ))}
          </HorizontalRail>

          {/* CATEGORIES */}
          <SectionTitleOnly title="Categorías" />

          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.id} icon={c.icon} label={c.label} border={c.border} />
            ))}
          </View>

          {/* CTA (YA NO ES ABSOLUTO, NO TAPA EL TAB BAR) */}
          <View style={[styles.ctaSection, { paddingBottom: 12 + Math.max(0, insets.bottom * 0) }]}>
            <View style={styles.ctaCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.ctaKicker}>Tu camino te espera</Text>
                <Text style={styles.ctaTitle}>Guarda tu progreso</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Iniciar sesión"
                onPress={() => {}}
                style={({ pressed }) => [styles.loginBtn, pressed && styles.pressed]}
              >
                <Text style={styles.loginBtnText}>Iniciar sesión</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Components ---------- */

function PrimaryButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
    >
      <MaterialIcons name={icon} size={20} color="#fff" />
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryCyanButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.cyanBtn, pressed && styles.pressed]}
    >
      <MaterialIcons name={icon} size={20} color={TOKENS.secondaryCyan} />
      <Text style={styles.cyanBtnText}>{label}</Text>
    </Pressable>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: {
  title: string;
  actionLabel: string;
  onActionPress: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        onPress={onActionPress}
        hitSlop={10}
      >
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

function SectionTitleOnly({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitleOnly}>
      <Text style={styles.sectionLabel}>{title}</Text>
    </View>
  );
}

function HorizontalRail({
  children,
  contentPadding,
}: {
  children: React.ReactNode;
  contentPadding: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.rail, { paddingHorizontal: contentPadding }]}
    >
      {children}
    </ScrollView>
  );
}

function VideoCardItem({ card }: { card: VideoCard }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Video: ${card.title}`}
      onPress={() => {}}
      style={({ pressed }) => [styles.videoCard, pressed && styles.pressed]}
    >
      <View style={styles.videoThumbWrap}>
        <Image source={{ uri: card.imageUrl }} style={styles.videoThumb} accessibilityLabel={card.alt} />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{card.duration}</Text>
        </View>
      </View>

      <Text style={styles.videoTitle} numberOfLines={1}>
        {card.title}
      </Text>
      <Text style={styles.videoMeta} numberOfLines={1}>
        {card.meta}
      </Text>
    </Pressable>
  );
}

function StartHereCard({
  icon,
  label,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {}}
      style={({ pressed }) => [styles.startCard, pressed && styles.pressed]}
    >
      <MaterialIcons name={icon} size={22} color={TOKENS.violet} />
      <Text style={styles.startCardText}>{label}</Text>
    </Pressable>
  );
}

function CategoryCard({
  icon,
  label,
  border,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  border: "cyan" | "green" | "violet" | "blue";
}) {
  const borderStyle =
    border === "cyan"
      ? styles.borderCyan
      : border === "green"
      ? styles.borderGreen
      : border === "blue"
      ? styles.borderBlue
      : styles.borderViolet;

  const iconColor =
    border === "cyan"
      ? TOKENS.secondaryCyan
      : border === "green"
      ? TOKENS.secondaryGreen
      : border === "blue"
      ? TOKENS.blue
      : TOKENS.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Categoría: ${label}`}
      onPress={() => {}}
      style={({ pressed }) => [styles.catCard, borderStyle, pressed && styles.pressed]}
    >
      <MaterialIcons name={icon} size={22} color={iconColor} />
      <Text style={styles.catText}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Design tokens ---------- */

const TOKENS = {
  backgroundDark: "#0A0A0A",
  primary: "#e619e5",
  secondaryCyan: "#00f2ff",
  secondaryGreen: "#39ff14",
  textMuted: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  blue: "#60a5fa",
  violet: "#a78bfa",
  px: 24,
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: TOKENS.backgroundDark,
    alignItems: "center",
  },
  shell: {
    flex: 1,
    backgroundColor: TOKENS.backgroundDark,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "rgba(230,25,229,0.10)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 10 },
    }),
  },

  scrollContent: {
    paddingTop: 8,
  },

  header: {
    paddingHorizontal: TOKENS.px,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(230,25,229,1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: TOKENS.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
      android: { elevation: 6 },
    }),
  },
  h1: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2,
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "300",
    letterSpacing: 0.6,
    fontStyle: "italic",
    color: TOKENS.textMuted,
    marginBottom: 32,
    textAlign: "center",
  },

  primaryBtn: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: TOKENS.primary,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: TOKENS.primary, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
      android: { elevation: 6 },
    }),
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  sectionPad: {
    paddingHorizontal: TOKENS.px,
    marginBottom: 40,
  },
  cyanBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,242,255,0.30)",
    backgroundColor: "rgba(0,242,255,0.05)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...Platform.select({
      ios: { shadowColor: TOKENS.secondaryCyan, shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
      android: { elevation: 4 },
    }),
  },
  cyanBtnText: {
    color: TOKENS.secondaryCyan,
    fontWeight: "800",
    fontSize: 14,
  },

  sectionHeader: {
    paddingHorizontal: TOKENS.px,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleOnly: {
    paddingHorizontal: TOKENS.px,
    marginBottom: 16,
  },
  sectionLabel: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  sectionAction: {
    color: TOKENS.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  rail: {
    gap: 16,
    paddingBottom: 40,
  },

  videoCard: {
    width: 256,
  },
  videoThumbWrap: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    aspectRatio: 16 / 9,
    backgroundColor: "rgba(255,255,255,0.04)",
    position: "relative",
  },
  videoThumb: {
    width: "100%",
    height: "100%",
    opacity: 0.82,
  },
  durationBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: TOKENS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  durationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
  videoTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  videoMeta: {
    color: TOKENS.gray500,
    fontSize: 12,
    marginTop: 2,
  },

  startCard: {
    width: 160,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.30)",
    backgroundColor: "rgba(139,92,246,0.10)",
    gap: 10,
  },
  startCardText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },

  categoriesGrid: {
    paddingHorizontal: TOKENS.px,
    paddingBottom: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  catCard: {
    width: "47%",
    aspectRatio: 1,
    padding: 16,
    borderRadius: 12,
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  catText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },

  borderCyan: { borderWidth: 1, borderColor: "rgba(0,242,255,0.30)", backgroundColor: "rgba(0,242,255,0.05)" },
  borderGreen: { borderWidth: 1, borderColor: "rgba(57,255,20,0.30)", backgroundColor: "rgba(57,255,20,0.05)" },
  borderViolet: { borderWidth: 1, borderColor: "rgba(139,92,246,0.30)", backgroundColor: "rgba(139,92,246,0.05)" },
  borderBlue: { borderWidth: 1, borderColor: "rgba(59,130,246,0.30)", backgroundColor: "rgba(59,130,246,0.05)" },

  // CTA al final (no absoluta)
  ctaSection: {
    paddingHorizontal: TOKENS.px,
    paddingTop: 8,
  },
  ctaCard: {
    backgroundColor: "rgba(0,0,0,0.80)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(230,25,229,0.30)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 8 },
    }),
  },
  ctaKicker: {
    fontSize: 10,
    color: TOKENS.textMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    marginTop: 2,
  },
  loginBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: TOKENS.primary,
  },
  loginBtnText: {
    color: TOKENS.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
});

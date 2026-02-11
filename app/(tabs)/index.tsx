import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: SCREEN_W } = Dimensions.get("window");
const MAX_W = 430; // solo para que se parezca al mock, en RN real suele ocupar todo

type FeaturedItem = {
  id: string;
  title: string;
  meta: string; // "Bienestar • 2.4k vistas"
  duration: string; // "12:40"
  imageUri?: string; // opcional
};

export default function HomeScreen() {
  const router = useRouter();

  // Mock seguro (sin hotlink frágil). Cambia imageUri por tus assets o thumbnails.
  const featured: FeaturedItem[] = useMemo(
    () => [
      {
        id: "1",
        title: "Yoga para la ansiedad nocturna",
        meta: "Bienestar • 2.4k vistas",
        duration: "12:40",
        imageUri:
          "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=60",
      },
      {
        id: "2",
        title: "Hacer compost en casa: Guía rápida",
        meta: "Medio ambiente • 1.8k vistas",
        duration: "05:15",
        imageUri:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=60",
      },
    ],
    []
  );

  const onExplore = () => {
    // Ajusta esta ruta cuando crees app/(tabs)/content.tsx
    // router.push("/(tabs)/content");
    router.push("/(tabs)/content"); // por ahora (según tu estructura actual)
  };

  const onQuickRoutine = () => {
    // Placeholder: luego lo conectas a una lista curada.
    // router.push("/(tabs)/activity");
    router.push("/modal"); // si quieres probar navegación sin crear pantalla
  };

  const goAuth = () => router.push("/(auth)/login"); // si aún no existe, créala luego

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.orchidCircle, styles.glowMagenta]}>
            <MaterialIcons name="filter-vintage" size={34} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Planta de Transformación</Text>
          <Text style={styles.subtitle}>Pequeños hábitos, gran cambio</Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaBlock}>
          <NeonButton
            variant="filled"
            icon="explore"
            label="Explorar contenido"
            onPress={onExplore}
          />
          <NeonButton
            variant="outline"
            icon="bolt"
            label="Rutina rápida (5 min)"
            onPress={onQuickRoutine}
          />
        </View>

        {/* Empieza por aquí */}
        <SectionHeader title="Empieza por aquí" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          <NeonCardSmall
            icon="auto-awesome-motion"
            label="Programas guiados"
            accent="violet"
            onPress={() => router.push("/(tabs)/content")}
          />
          <NeonCardSmall
            icon="play-circle-outline"
            label="Videos cortos"
            accent="violet"
            onPress={() => router.push("/(tabs)/content")}
          />
          <NeonCardSmall
            icon="stars"
            label="Recomendado para hoy"
            accent="violet"
            onPress={() => router.push("/(tabs)/content")}
          />
        </ScrollView>

        {/* Categorías */}
        <SectionHeader title="Categorías" />
        <View style={styles.grid}>
          <CategoryCard
            icon="fitness-center"
            label="Actividad física"
            accent="cyan"
            onPress={() => router.push("/(tabs)/content")}
          />
          <CategoryCard
            icon="eco"
            label="Medio ambiente"
            accent="green"
            onPress={() => router.push("/(tabs)/content")}
          />
          <CategoryCard
            icon="self-improvement"
            label="Bienestar"
            accent="magenta"
            onPress={() => router.push("/(tabs)/content")}
          />
          <CategoryCard
            icon="groups"
            label="Comunidad"
            accent="blue"
            onPress={() => router.push("/(tabs)/content")}
          />
        </View>

        {/* Destacados */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Destacados</Text>
          <Pressable onPress={() => router.push("/(tabs)/content")} hitSlop={10}>
            <Text style={styles.sectionAction}>Ver todo</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {featured.map((item) => (
            <FeaturedCard key={item.id} item={item} onPress={() => router.push("/(tabs)/content")} />
          ))}
        </ScrollView>

        {/* Espacio para que no tape el banner flotante */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Bottom auth prompt flotante (realista en RN) */}
      <View style={styles.bottomFloatingWrap} pointerEvents="box-none">
        <View style={[styles.bottomFloating, styles.glowMagentaSoft]}>
          <View>
            <Text style={styles.bottomSmall}>Tu camino te espera</Text>
            <Text style={styles.bottomStrong}>Guarda tu progreso</Text>
          </View>

          <Pressable
            onPress={goAuth}
            style={({ pressed }) => [
              styles.bottomButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.bottomButtonText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- Components ---------------- */

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function NeonButton({
  variant,
  icon,
  label,
  onPress,
}: {
  variant: "filled" | "outline";
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const filled = variant === "filled";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btnBase,
        filled ? styles.btnFilled : styles.btnOutline,
        filled ? styles.glowMagenta : styles.glowCyan,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <MaterialIcons
        name={icon}
        size={20}
        color={filled ? COLORS.text : COLORS.cyan}
      />
      <Text style={[styles.btnText, !filled && { color: COLORS.cyan }]}>{label}</Text>
    </Pressable>
  );
}

function NeonCardSmall({
  icon,
  label,
  accent,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  accent: "violet";
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.smallCard,
        styles.glowVioletSoft,
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.smallIconWrap}>
        <MaterialIcons name={icon} size={22} color={COLORS.violet} />
      </View>
      <Text style={styles.smallLabel} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

function CategoryCard({
  icon,
  label,
  accent,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  accent: "cyan" | "green" | "magenta" | "blue";
  onPress: () => void;
}) {
  const accentColor =
    accent === "cyan"
      ? COLORS.cyan
      : accent === "green"
      ? COLORS.green
      : accent === "blue"
      ? COLORS.blue
      : COLORS.primary;

  const borderStyle = {
    borderColor: withAlpha(accentColor, 0.35),
    backgroundColor: withAlpha(accentColor, 0.06),
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.catCard,
        borderStyle,
        pressed && { opacity: 0.9 },
      ]}
    >
      <MaterialIcons name={icon} size={22} color={accentColor} />
      <Text style={styles.catLabel}>{label}</Text>
    </Pressable>
  );
}

function FeaturedCard({
  item,
  onPress,
}: {
  item: FeaturedItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.featuredCard, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.featuredMedia}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.featuredImage} />
        ) : (
          <View style={styles.featuredPlaceholder} />
        )}

        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>

      <Text style={styles.featuredTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.featuredMeta} numberOfLines={1}>
        {item.meta}
      </Text>
    </Pressable>
  );
}

/* ---------------- Styles ---------------- */

const COLORS = {
  bg: "#0A0A0A",
  text: "#EDEDED",
  muted: "#A7A7A7",
  muted2: "#8B8B8B",
  primary: "#E619E5",
  cyan: "#00F2FF",
  green: "#39FF14",
  violet: "#8B5CF6",
  blue: "#3B82F6",
};

function withAlpha(hex: string, alpha: number) {
  // hex "#RRGGBB" -> "rgba(r,g,b,a)"
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: MAX_W,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 18,
  },
  orchidCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: withAlpha(COLORS.primary, 0.35),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 4,
    fontSize: 12,
    fontStyle: "italic",
    letterSpacing: 0.6,
  },

  ctaBlock: {
    marginTop: 8,
    marginBottom: 24,
    gap: 12,
  },
  btnBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnFilled: {
    backgroundColor: COLORS.primary,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: withAlpha(COLORS.cyan, 0.6),
    backgroundColor: withAlpha(COLORS.cyan, 0.06),
  },
  btnText: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 14,
  },

  sectionHeader: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionRow: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.85,
  },
  sectionAction: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  hScroll: {
    paddingRight: 6,
    gap: 12,
    paddingBottom: 6,
  },

  smallCard: {
    width: 160,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: withAlpha(COLORS.violet, 0.35),
    backgroundColor: withAlpha(COLORS.violet, 0.08),
  },
  smallIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: withAlpha(COLORS.violet, 0.25),
  },
  smallLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  catCard: {
    width: (Math.min(SCREEN_W, MAX_W) - 20 * 2 - 12) / 2, // 2 columnas + gap
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  catLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },

  featuredCard: {
    width: 260,
  },
  featuredMedia: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  featuredPlaceholder: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  durationBadge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: 1,
    borderColor: withAlpha(COLORS.primary, 0.45),
  },
  durationText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  featuredTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },
  featuredMeta: {
    color: COLORS.muted2,
    fontSize: 11,
    marginTop: 2,
  },

  bottomFloatingWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 14,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bottomFloating: {
    width: "100%",
    maxWidth: MAX_W,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.72)",
    borderWidth: 1,
    borderColor: withAlpha(COLORS.primary, 0.35),
  },
  bottomSmall: {
    color: COLORS.muted2,
    fontSize: 11,
  },
  bottomStrong: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
  },
  bottomButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: withAlpha(COLORS.primary, 0.7),
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  bottomButtonText: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 12,
  },

  // Glows (realistas en RN)
  glowMagenta: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  glowMagentaSoft: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  glowCyan: {
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  glowVioletSoft: {
    shadowColor: COLORS.violet,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
});

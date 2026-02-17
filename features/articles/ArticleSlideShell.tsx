// features/articles/ArticleSlideShell.tsx
import React from "react";
import { View, Text, StyleSheet, Pressable, Platform, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  progressText: string;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  children: React.ReactNode;
};

const BG = "#0B0B0F";
const PRIMARY = "#13EC5B";

export default function ArticleSlideShell({
  progressText,
  onBack,
  onNext,
  nextLabel = "Siguiente",
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  // Mantén tu estética base, pero respeta navegación por 3 botones / safe area real.
  const footerBottom = Math.max(insets.bottom, 18);

  // Reserva realista para que el contenido no quede debajo del CTA.
  // (CTA ~52-60px + gradiente + márgenes)
  const CTA_ESTIMATED_HEIGHT = 56;
  const FOOTER_TOP_PADDING = 24;
  const EXTRA_GAP = 18;

  const scrollBottomPadding = footerBottom + FOOTER_TOP_PADDING + CTA_ESTIMATED_HEIGHT + EXTRA_GAP;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={12} style={styles.iconBtn}>
            <Text style={styles.iconText}>←</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.progress}>{progressText}</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {children}
        </ScrollView>

        {/* Fixed CTA */}
        <LinearGradient
          colors={[
            "rgba(11,11,15,0)",
            "rgba(11,11,15,0.75)",
            "rgba(11,11,15,1)",
          ]}
          style={[styles.footerGrad, { paddingBottom: footerBottom }]}
          pointerEvents="box-none"
        >
          <Pressable
            onPress={onNext}
            accessibilityRole="button"
            accessibilityLabel={nextLabel}
            style={({ pressed }) => [styles.ctaBtn, pressed && styles.ctaPressed]}
          >
            <Text style={styles.ctaText}>{nextLabel}</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 18,

    // Nota: esto es solo para no “apretar” el header en Android.
    // SafeAreaView ya maneja el inset superior.
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { color: "white", fontSize: 22, opacity: 0.95 },

  headerCenter: { flex: 1, alignItems: "center" },
  progress: {
    color: "rgba(19,236,91,0.65)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 3,
  },
  headerSpacer: { width: 40 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 10,
    // paddingBottom ahora es dinámico para no tapar contenido con el CTA fijo
  },

  footerGrad: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    paddingHorizontal: 18,
    paddingTop: 24,
    // paddingBottom dinámico con insets
  },

  ctaBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: PRIMARY,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ctaPressed: { transform: [{ scale: 0.985 }] },
  ctaText: { color: "black", fontSize: 16, fontWeight: "800" },
  ctaArrow: { color: "black", fontSize: 18, fontWeight: "900" },
});

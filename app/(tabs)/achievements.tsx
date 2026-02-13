import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Stitch } from "../../constants/theme";
import { GlassCard } from "../../components/ui/GlassCard";

type Medal = {
  id: string;
  title: string;
  desc: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  locked?: boolean;
};

export default function AchievementsScreen() {
  // Mock (luego lo conectas a backend/perfil)
  const level = 12;
  const xp = 850;
  const xpMax = 1000;
  const streakDays = 7;
  const challengesDone = 24;

  const progress = Math.max(0, Math.min(1, xp / xpMax));

  const medals: Medal[] = useMemo(
    () => [
      {
        id: "m1",
        title: "Iniciador",
        desc: "Primer reto completado",
        icon: "eco",
      },
      {
        id: "m2",
        title: "Madrugador",
        desc: "7 AM racha activa",
        icon: "wb-sunny",
      },
      {
        id: "m3",
        title: "Maestro de Planta",
        desc: "Completa 50 procesos",
        icon: "factory",
        locked: true,
      },
      {
        id: "m4",
        title: "Guardián Nocturno",
        desc: "Eficiencia 100% de noche",
        icon: "shield-moon",
        locked: true,
      },
    ],
    []
  );

  return (
    <View style={styles.screen}>
      {/* Sticky header */}
      <View style={styles.header}>
      <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.headerOverlay} />

      <Text style={styles.headerTitleLeft}>Logros</Text>

      <Pressable style={styles.headerBtn} hitSlop={10} onPress={() => {}}>
        <MaterialIcons name="share" size={20} color={Stitch.colors.primary} />
      </Pressable>
    </View>


      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Level Progress */}
        <GlassCard style={styles.levelCard}>
          <View style={styles.levelTop}>
            <View>
              <Text style={styles.kicker}>Tu Progreso</Text>
              <Text style={styles.levelTitle}>Nivel {level}</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.xpText}>
                {xp} / {xpMax} XP
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>

          <Text style={styles.levelHint}>
            Estás a solo {xpMax - xp} XP de alcanzar el nivel {level + 1}.
          </Text>
        </GlassCard>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(249,115,22,0.20)" }]}>
              <MaterialIcons name="local-fire-department" size={26} color="#F97316" />
            </View>
            <Text style={styles.statValue}>{streakDays} Días</Text>
            <Text style={styles.statLabel}>Racha Actual</Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(33,196,93,0.20)" }]}>
              <MaterialIcons name="task-alt" size={26} color={Stitch.colors.primary} />
            </View>
            <Text style={styles.statValue}>{challengesDone}</Text>
            <Text style={styles.statLabel}>Retos Completados</Text>
          </GlassCard>
        </View>

        {/* Medals */}
        <View style={styles.medalsHeader}>
          <Text style={styles.sectionTitle}>Medallas Obtenidas</Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>6 / 20</Text>
          </View>
        </View>

        <View style={styles.medalsGrid}>
          {medals.map((m) => (
            <MedalItem key={m.id} medal={m} />
          ))}
        </View>

        {/* CTA */}
        <Pressable style={styles.ctaBtn} onPress={() => {}}>
          <Text style={styles.ctaText}>Ver todos los retos</Text>
          <MaterialIcons name="trending-flat" size={20} color={Stitch.colors.primary} />
        </Pressable>

        <View style={{ height: 18 }} />
      </ScrollView>
    </View>
  );
}

function MedalItem({ medal }: { medal: Medal }) {
  const locked = !!medal.locked;

  return (
    <View style={[styles.medalItem, locked && { opacity: 0.55 }]}>
      {/* Glow / badge */}
      <View style={styles.medalGlow} />

      <View
        style={[
          styles.medalCircle,
          locked ? styles.medalLocked : styles.medalUnlocked,
        ]}
      >
        <MaterialIcons
          name={medal.icon}
          size={32}
          color={locked ? "rgba(255,255,255,0.35)" : Stitch.colors.primary}
        />
      </View>

      <Text style={[styles.medalTitle, locked && { color: "rgba(255,255,255,0.60)" }]}>
        {medal.title}
      </Text>
      <Text style={styles.medalDesc} numberOfLines={2}>
        {medal.desc}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },

 header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(33,196,93,0.10)",
    overflow: "hidden",
  },

  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleLeft: {
    color: "#fff",
    fontSize: 24,        // igual que Home/Retos
    fontWeight: "900",
    letterSpacing: -0.2,
  },


  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
  },

  // Level card
  levelCard: {
    borderRadius: 18,
    padding: 16,
    borderColor: "rgba(33,196,93,0.10)",
    backgroundColor: "rgba(33,196,93,0.05)",
  },
  levelTop: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  kicker: {
    color: Stitch.colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  levelTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  xpText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Stitch.colors.primary,
    borderRadius: 999,
  },
  levelHint: {
    marginTop: 12,
    color: "rgba(255,255,255,0.60)",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "italic",
    lineHeight: 16,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 24,
  },
  statLabel: {
    marginTop: 8,
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },

  // Medals
  medalsHeader: {
    marginTop: 22,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  countPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.18)",
  },
  countPillText: {
    color: Stitch.colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  medalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },
  medalItem: {
    width: "48%",
    alignItems: "center",
  },
  medalGlow: {
    position: "absolute",
    top: 6,
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.18)",
    // “blur” fake (mejor que nada sin libs extra)
    opacity: 0.7,
    transform: [{ scale: 1.08 }],
  },
  medalCircle: {
    width: 92,
    height: 92,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    marginBottom: 10,
  },
  medalUnlocked: {
    borderColor: Stitch.colors.primary,
    backgroundColor: "rgba(33,196,93,0.12)",
  },
  medalLocked: {
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  medalTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  medalDesc: {
    marginTop: 4,
    color: "rgba(255,255,255,0.55)",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },

  // CTA
  ctaBtn: {
    marginTop: 22,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Stitch.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(0,0,0,0.10)",
  },
  ctaText: {
    color: Stitch.colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
});

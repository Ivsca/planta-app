// app/(tabs)/achievements.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { LoginModal } from "../../components/auth/LoginModal";
import { GlassCard } from "../../components/ui/GlassCard";
import { API_BASE } from "../../constants/api";
import { Stitch } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useRequireAuth } from "../../hooks/use-require-auth";

type Medal = {
  id: string;
  title: string;
  desc: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  locked?: boolean;
};

type AchievementsSummary = {
  streak: { current: number; best: number; lastActiveLocalDate: string | null };
  progress: {
    completed: { article: number; routine: number; challenge: number };
  };
  challenges: {
    completedCount: number;
    recent: { refId: string; at: string; meta: object }[];
  };
  medals: { id: string; earnedAt: string; meta: object }[];
};

const MEDAL_CATALOG: Omit<Medal, "locked">[] = [
  { id: "FIRST_ARTICLE", title: "Primer artículo", desc: "Lee tu primer artículo", icon: "menu-book" },
  { id: "FIRST_ROUTINE", title: "Primera rutina", desc: "Completa tu primera rutina", icon: "fitness-center" },
  { id: "FIRST_CHALLENGE", title: "Primer reto", desc: "Completa tu primer reto", icon: "eco" },
  { id: "STREAK_3", title: "Racha de 3", desc: "3 días seguidos activo", icon: "wb-sunny" },
  { id: "STREAK_7", title: "Racha de 7", desc: "7 días seguidos activo", icon: "local-fire-department" },
  { id: "CHALLENGES_5", title: "5 retos", desc: "Completa 5 retos", icon: "emoji-events" },
];

export default function AchievementsScreen() {
  const { isAuthenticated, token } = useAuth();
  const { requireAuth, loginModalVisible, dismissLogin, onLoginSuccess } = useRequireAuth();

  const [summary, setSummary] = useState<AchievementsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/achievements/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: AchievementsSummary = await res.json();
      setSummary(data);
    } catch (e: any) {
      setError(e.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSummary();
    }
  }, [isAuthenticated, token, fetchSummary]);

  /* ── Datos derivados del resumen ── */
  const completedArticles = summary?.progress.completed.article ?? 0;
  const completedRoutines = summary?.progress.completed.routine ?? 0;
  const completedChallenges = summary?.progress.completed.challenge ?? 0;
  const totalCompleted = completedArticles + completedRoutines + completedChallenges;

  const streakDays = summary?.streak.current ?? 0;
  const streakBest = summary?.streak.best ?? 0;

  const progressValue = totalCompleted > 0 ? Math.min(1, totalCompleted / 50) : 0;
  const progressLabel = `${totalCompleted} completados`;

  const earnedIds = useMemo(
    () => new Set(summary?.medals.map((m) => m.id) ?? []),
    [summary]
  );

  const medals: Medal[] = useMemo(
    () => MEDAL_CATALOG.map((m) => ({ ...m, locked: !earnedIds.has(m.id) })),
    [earnedIds]
  );

  const earnedCount = medals.filter((m) => !m.locked).length;
  const totalCount = medals.length;

  /* ── Pantalla bloqueada para usuarios no autenticados ── */
  if (!isAuthenticated) {
    return (
      <View style={styles.screen}>
        <LoginModal visible={loginModalVisible} onDismiss={dismissLogin} onSuccess={onLoginSuccess} />

        <View style={styles.header}>
          <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.headerOverlay} />
          <Text style={styles.headerTitleLeft}>Logros</Text>
        </View>

        <View style={styles.lockedContainer}>
          <View style={styles.lockedIconWrap}>
            <MaterialIcons name="lock-outline" size={56} color={Stitch.colors.primary} />
          </View>
          <Text style={styles.lockedTitle}>Inicia sesión para ver tus logros</Text>
          <Text style={styles.lockedDesc}>
            Registra tu progreso, desbloquea medallas y compite con la comunidad.
          </Text>
          <Pressable
            style={styles.lockedBtn}
            onPress={() => requireAuth(() => {})}
          >
            <MaterialIcons name="login" size={20} color="#000" />
            <Text style={styles.lockedBtnText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LoginModal
        visible={loginModalVisible}
        onDismiss={dismissLogin}
        onSuccess={onLoginSuccess}
      />

      {/* Sticky header */}
      <View style={styles.header}>
        <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.headerOverlay} />

        <Text style={styles.headerTitleLeft}>Logros</Text>

        <Pressable style={styles.headerBtn} hitSlop={10} onPress={() => requireAuth(() => {})}>
          <MaterialIcons name="share" size={20} color={Stitch.colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading && !summary ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color={Stitch.colors.primary} />
          </View>
        ) : null}
        {/* Error */}
        {error ? (
          <GlassCard style={styles.errorCard}>
            <Text style={styles.errorTitle}>No se pudieron cargar tus logros</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={fetchSummary}>
              <Text style={styles.retryText}>Reintentar</Text>
              <MaterialIcons name="refresh" size={18} color={Stitch.colors.primary} />
            </Pressable>
          </GlassCard>
        ) : null}

        {/* Progreso */}
        <GlassCard style={styles.levelCard}>
          <View style={styles.levelTop}>
            <View>
              <Text style={styles.kicker}>Tu Progreso</Text>
              <Text style={styles.levelTitle}>Progreso general</Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.xpText}>{loading ? "Cargando…" : progressLabel}</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progressValue * 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.levelHint}>
            Artículos: {completedArticles} • Rutinas: {completedRoutines} • Retos:{" "}
            {completedChallenges}
          </Text>
        </GlassCard>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(249,115,22,0.20)" }]}>
              <MaterialIcons name="local-fire-department" size={26} color="#F97316" />
            </View>
            <Text style={styles.statValue}>{loading ? "—" : `${streakDays} días`}</Text>
            <Text style={styles.statLabel}>Racha actual</Text>
            <Text style={styles.statSubtle}>
              Mejor: {loading ? "—" : `${streakBest} días`}
            </Text>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "rgba(33,196,93,0.20)" }]}>
              <MaterialIcons name="task-alt" size={26} color={Stitch.colors.primary} />
            </View>
            <Text style={styles.statValue}>{loading ? "—" : completedChallenges}</Text>
            <Text style={styles.statLabel}>Retos completados</Text>
            <Text style={styles.statSubtle}>
              Total completados: {loading ? "—" : completedArticles + completedRoutines + completedChallenges}
            </Text>
          </GlassCard>
        </View>

        {/* Medallas */}
        <View style={styles.medalsHeader}>
          <Text style={styles.sectionTitle}>Medallas</Text>
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>
              {loading ? "—" : `${earnedCount} / ${totalCount}`}
            </Text>
          </View>
        </View>

        <View style={styles.medalsGrid}>
          {medals.map((m) => (
            <MedalItem key={m.id} medal={m} />
          ))}
        </View>

        {/* CTA */}
        <Pressable style={styles.ctaBtn} onPress={() => requireAuth(() => {})}>
          <Text style={styles.ctaText}>Ver todos los retos</Text>
          <MaterialIcons name="trending-flat" size={20} color={Stitch.colors.primary} />
        </Pressable>

        <View style={{ height: 18 }} />
      </ScrollView>
    </View>
  );
}

function MedalItem({
  medal,
}: {
  medal: {
    id: string;
    title: string;
    desc: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    locked?: boolean;
  };
}) {
  const locked = !!medal.locked;

  return (
    <View style={[styles.medalItem, locked && { opacity: 0.55 }]}>
      <View style={styles.medalGlow} />

      <View style={[styles.medalCircle, locked ? styles.medalLocked : styles.medalUnlocked]}>
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
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 24,
  },

  errorCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 14,
  },
  errorTitle: { color: "#fff", fontWeight: "900", fontSize: 14 },
  errorText: { marginTop: 6, color: "rgba(255,255,255,0.65)", fontWeight: "600" },
  retryBtn: { marginTop: 12, flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" },
  retryText: { color: Stitch.colors.primary, fontWeight: "900" },

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
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.3,
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
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 22,
    textAlign: "center",
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
  statSubtle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.50)",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },

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

  // Locked screen
  lockedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  lockedIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 999,
    backgroundColor: "rgba(33,196,93,0.10)",
    borderWidth: 2,
    borderColor: "rgba(33,196,93,0.20)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  lockedTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  lockedDesc: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  lockedBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Stitch.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 18,
  },
  lockedBtnText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "900",
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
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { LoginModal } from "../../components/auth/LoginModal";
import { GlassCard } from "../../components/ui/GlassCard";
import { Stitch } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useRequireAuth } from "../../hooks/use-require-auth";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { getAvatarUri } from "../profile/avatarStorage";
import { useFocusEffect } from "expo-router";





const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDdguwHSGWzeebuvqDDbvKzkQB2NCV9UKhwCSBI5dGknXFounwX0mQJF7QKQ4w8qcx9AbfNe1txMAGk_6y6-GHz54hz8pM3tgZ2yKoDGSt0k_KI1jrbwwXazrlJyxvay4AFaEoBjObDeWzbV5rFRsodBUkJehvgc-PXRJ0LzJwpSb1ybjM-vDTK0WGK0kl9HqgYbZHhsx5HxFeznIY2DpeNvcFxb654xN4VlxuZ82UOZRfjxoNdFGfAn3n1F-zwIlu9zNrnBsvMM8k";

const CONTINUE_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCsoMU8b-9L8sXrOU-nXffg7PbRFCexFzFGnmtjtAIZX8tmUymUleCYmPkEG8KHmkwb4QxtNCLE6eDFmLp-HR-ntbFTzpQeNpnFBinDAWCVHro7dqfO2RQ8a-EHU5mceUEttZ-0LekrrM5twWpq5IDCanaeqCptg9N2SPeI8I1Zg1Ahy9Iqq_rhwiic4seGCk71vHMtr1Yyomvf5Sywo7cnv0RurqoRNuzwrZJV1n_mIKxhDOn-B1P0w_5-jRKHC9HD4PGuNee32A0";

const CONTINUE_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBU9dEJudkJE_tnsFMJ3ExW0_cDK0iNCXWIDcaflT6LOEY9kaewZel0S4_vBXXCLqL479epKEaSs7xcmG-ZKX2GA0RQjW-OrjcQquy0ZtF-eG7zURZkZLAl_V52Y0R-6BzwcUX3QNKfl8ZTdfELD3fZzcNiV-vgmXgFvRccswjtbCC8WXQES2ma3JjnaTtpB18FYqnZGAtqefrdQaMmj_NtVjL9HOH8KdryBeZMuQG22X3pIFZDnx-M2rgNprAkBqI6FSxwoNzPQ7M";

const REC_1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAKlu_eA2a0JMcjp7mixBRFY0guUzODpGiwoDypwy_7AkzGEZg6JQK7V1cO3a47ndtUnkOz3KI3p_hxz4r22KyzPxh9uuyJTLjjtprXzFooylN7PQSpqR1sbwBQokPfP8OfA5iQbD0zZs9QdpVbxXTzGYibGzy4dFAkvb1gppuQht8u5GCyEu330aSJg1Xo8Lyww2IdSz9JMY9UH3CPtzKSOpxoH3-HtHRyp31tjlRudEU_102VvxUzsA2yPAt3KAwKAdxlVHM09ME";

const REC_2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCwhitMUELTr7K8AE2qYUkf74d-koDJsORADmvazVNaYZRBhmImL56prdwFTMer954kEB6FBdBKGkbDHgRITORh9kiCV3BNGCH8aH4fWuQJJG2ejeI7VEUlagcGByrr7TyoK_mjymLKS_Xf-fkQkHvdVj6YjusQ-DFAizTURKK4avtzb_kHwSj7Zc_at0jZScLpAyyVJ_yQ7ESRP2hrWWC4wKcIFIqwPIQDzfrbEkW2uwNB4bAKK8QnOb5kwHLBXgDJ_OzgIsWQ_NM";

function ProgressRing({ percent }: { percent: number }) {
  const size = 80;
  const stroke = 6;
  const r = size / 2 - stroke;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;

  const dashOffset = useMemo(() => {
    const clamped = Math.max(0, Math.min(100, percent));
    return c * (1 - clamped / 100);
  }, [c, percent]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={stroke}
          fill="transparent"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={Stitch.colors.primary}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.ringLabel}>
        <Text style={styles.ringLabelText}>{Math.round(percent)}%</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { requireAuth, loginModalVisible, dismissLogin, onLoginSuccess } = useRequireAuth();

  const displayName = isAuthenticated && user ? user.name : "Visitante";

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!isAuthenticated || !user?.id) {
        setAvatarUri(null);
        return;
      }
      const saved = await getAvatarUri(user.id);
      setAvatarUri(saved);
    })();
  }, [isAuthenticated, user?.id]);





  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <LoginModal visible={loginModalVisible} onDismiss={dismissLogin} onSuccess={onLoginSuccess} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
           <View style={styles.avatarWrap}>
            <View style={styles.avatarMask}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              ) : (
                <MaterialIcons name="person" size={26} color="rgba(255,255,255,0.35)" />
              )}
            </View>
          </View>



            <View style={{ flex: 1 }}>
              <View style={styles.helloRow}>
                <Text style={styles.helloText}>Hola, {displayName}</Text>
                <View style={styles.streakPill}>
                  <MaterialIcons
                    name="local-fire-department"
                    size={14}
                    color={Stitch.colors.warning}
                  />
                  <Text style={styles.streakText}>7</Text>
                </View>
              </View>
              <Text style={styles.subtitle}>Planta de Transformación</Text>
            </View>
          </View>

          <Pressable style={styles.notifBtn}>
            <MaterialIcons name="notifications" size={22} color="#fff" />
            <View style={styles.notifDot} />
          </Pressable>
        </View>

        {/* Progress */}
        <View style={styles.sectionPad}>
          <GlassCard style={styles.progressCard}>
            <ProgressRing percent={75} />
            <View style={{ flex: 1 }}>
              <Text style={styles.muted}>Meta diaria</Text>
              <Text style={styles.titleMd}>¡Casi llegas!</Text>
              <Text style={styles.primarySmall}>Sigue así, {displayName}</Text>
            </View>
          </GlassCard>
        </View>

        {/* Acción del día */}
        <View style={[styles.sectionPad, { marginTop: 10 }]}>
          <Pressable style={styles.heroWrap} onPress={() => requireAuth(() => {})}>
            <Image source={{ uri: HERO }} style={styles.heroImg} />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.45)", "rgba(0,0,0,0.90)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroKicker}>Acción del día</Text>
              <Text style={styles.heroTitle}>Rutina rápida (5 min)</Text>

              <View style={styles.heroBottomRow}>
                <View style={styles.heroMeta}>
                  <MaterialIcons name="schedule" size={16} color="rgba(255,255,255,0.70)" />
                  <Text style={styles.heroMetaText}>Hoy, 08:30 AM</Text>
                </View>

                <Pressable style={styles.heroBtn} onPress={() => requireAuth(() => {})}>
                  <Text style={styles.heroBtnText}>Comenzar</Text>
                  <MaterialIcons name="play-arrow" size={18} color={Stitch.colors.bg} />
                </Pressable>
              </View>
            </View>
          </Pressable>
        </View>

        {/* Continuar */}
        <View style={{ marginTop: 18 }}>
          <View style={[styles.rowBetween, styles.sectionPad]}>
            <Text style={styles.sectionTitle}>Continuar</Text>
            <Pressable onPress={() => requireAuth(() => {})}>
              <Text style={styles.sectionLink}>Ver todo</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
          >
            <Pressable onPress={() => requireAuth(() => {})}>
              <ContinueCard image={CONTINUE_1} title="Meditación matutina" minutes="12 min" progress={0.66} />
            </Pressable>
            <Pressable onPress={() => requireAuth(() => {})}>
              <ContinueCard image={CONTINUE_2} title="Clase de reciclaje" minutes="8 min" progress={0.25} />
            </Pressable>
          </ScrollView>
        </View>

        {/* Recomendado */}
        <View style={[styles.sectionPad, { marginTop: 22 }]}>
          <Text style={styles.sectionTitle}>Recomendado para ti</Text>

          <View style={{ marginTop: 14, gap: 12 }}>
            <Pressable onPress={() => requireAuth(() => {})}>
              <RecommendedRow
                image={REC_1}
                tag="Ambiental"
                tagColor={Stitch.colors.primary}
                tagBg="rgba(33,196,93,0.20)"
                title="Huerto urbano en casa"
                desc="Aprende a cultivar tus vegetales"
              />
            </Pressable>
            <Pressable onPress={() => requireAuth(() => {})}>
              <RecommendedRow
                image={REC_2}
                tag="Actividad física"
                tagColor="#60A5FA"
                tagBg="rgba(59,130,246,0.20)"
                title="Estiramiento básico"
                desc="Mejora tu flexibilidad diaria"
              />
            </Pressable>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function ContinueCard({
  image,
  title,
  minutes,
  progress,
}: {
  image: string;
  title: string;
  minutes: string;
  progress: number;
}) {
  return (
    <GlassCard style={styles.contCard}>
      <View style={styles.contImgWrap}>
        <Image source={{ uri: image }} style={styles.contImg} />
        <View style={styles.timePill}>
          <Text style={styles.timePillText}>{minutes}</Text>
        </View>
      </View>

      <View style={styles.contBody}>
        <Text style={styles.contTitle} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
      </View>
    </GlassCard>
  );
}

function RecommendedRow({
  image,
  tag,
  tagColor,
  tagBg,
  title,
  desc,
}: {
  image: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  title: string;
  desc: string;
}) {
  return (
    <GlassCard style={styles.recRow}>
      <Image source={{ uri: image }} style={styles.recImg} />
      <View style={{ flex: 1 }}>
        <View style={[styles.tagPill, { backgroundColor: tagBg }]}>
          <Text style={[styles.tagText, { color: tagColor }]}>{tag}</Text>
        </View>
        <Text style={styles.recTitle}>{title}</Text>
        <Text style={styles.recDesc} numberOfLines={1}>
          {desc}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.30)" />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },
  content: { paddingBottom: 24 },

  sectionPad: { paddingHorizontal: 24 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },

  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "rgba(33,196,93,0.20)",
    padding: 2,
  },

  avatarMask: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  avatarImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },



  helloRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  helloText: { color: "#fff", fontSize: 18, fontWeight: "800" },

  streakPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(249,115,22,0.20)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.30)",
  },
  streakText: { color: Stitch.colors.warning, fontSize: 12, fontWeight: "800" },

  subtitle: {
    color: Stitch.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 2,
    textTransform: "uppercase",
  },

  notifBtn: {
    width: 48,
    height: 48,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Stitch.colors.border,
    backgroundColor: Stitch.colors.card,
    overflow: "hidden",
  },
  notifDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: Stitch.colors.primary,
    borderWidth: 2,
    borderColor: Stitch.colors.bg,
  },

  progressCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ringLabel: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  ringLabelText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  muted: { color: Stitch.colors.textSoft, fontSize: 14, fontWeight: "600" },
  titleMd: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 2 },
  primarySmall: { color: Stitch.colors.primary, fontSize: 12, fontWeight: "800", marginTop: 6 },

  heroWrap: {
    borderRadius: 24,
    overflow: "hidden",
    height: 220,
    backgroundColor: "#111",
  },
  heroImg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  heroContent: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 24 },

  heroKicker: {
    color: Stitch.colors.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: "900", marginBottom: 14 },

  heroBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  heroMetaText: { color: "rgba(255,255,255,0.70)", fontSize: 14, fontWeight: "600" },

  heroBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Stitch.colors.primary,
    shadowColor: Stitch.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  heroBtnText: { color: Stitch.colors.bg, fontWeight: "900", fontSize: 14 },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  sectionLink: {
    color: Stitch.colors.primary,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  hList: { paddingHorizontal: 24, gap: 14 },

  contCard: { width: 240, borderRadius: 18 },
  contImgWrap: { height: 128, overflow: "hidden" },
  contImg: { width: "100%", height: "100%" },

  timePill: {
    position: "absolute",
    right: 10,
    bottom: 10,
    backgroundColor: "rgba(0,0,0,0.60)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  timePillText: { color: "#fff", fontSize: 10, fontWeight: "900", textTransform: "uppercase" },

  contBody: { padding: 14, gap: 10 },
  contTitle: { color: "#fff", fontSize: 14, fontWeight: "800" },

  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: Stitch.colors.primary },

  recRow: {
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  recImg: { width: 80, height: 80, borderRadius: 14 },

  tagPill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  tagText: { fontSize: 10, fontWeight: "900", textTransform: "uppercase" },

  recTitle: { color: "#fff", fontSize: 16, fontWeight: "900", marginTop: 6 },
  recDesc: { color: Stitch.colors.textMuted, fontSize: 12, fontWeight: "600", marginTop: 2 },
});

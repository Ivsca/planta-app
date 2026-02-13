import React from "react";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stitch } from "../../constants/theme";
import { GlassCard } from "../../components/ui/GlassCard";

const HERO =
  "https://images.unsplash.com/photo-1520975958221-19c5d6f1b4e1?auto=format&fit=crop&w=1200&q=60"; // placeholder

type Challenge = {
  id: string;
  title: string;
  desc: string;
  tag: "Actividad física" | "Ambiente" | "Bienestar";
  status: "Activo" | "Nuevo";
};

const CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Camina 1 km hoy",
    desc: "Suma a tu racha con un paseo corto.",
    tag: "Actividad física",
    status: "Activo",
  },
  {
    id: "c2",
    title: "7 días sin plástico",
    desc: "Evita plásticos de un solo uso.",
    tag: "Ambiente",
    status: "Nuevo",
  },
  {
    id: "c3",
    title: "5 min de respiración",
    desc: "Reduce estrés y mejora tu energía.",
    tag: "Bienestar",
    status: "Activo",
  },
];

export default function ChallengesScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.h1}>Retos</Text>
        </View>

        {/* HERO: Jugar */}
        <View style={styles.pad}>
          <Pressable style={styles.heroWrap} onPress={() => {}}>
            <Image source={{ uri: HERO }} style={styles.heroImg} />
            <LinearGradient
              colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.30)", "rgba(0,0,0,0.92)"]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroContent}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Mini-juego</Text>
              </View>

              <Text style={styles.heroTitle}>Jugar: Recolector de basura</Text>
              <Text style={styles.heroSub}>
                Recoge residuos y aprende hábitos simples mientras juegas.
              </Text>

              <View style={styles.heroBtnRow}>
                <View style={styles.heroBtn}>
                  <Text style={styles.heroBtnText}>Jugar</Text>
                  <MaterialIcons name="play-arrow" size={18} color={Stitch.colors.bg} />
                </View>

                <Text style={styles.heroHint}>*Unity lo integra tu compañero</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* LISTA: Retos */}
        <View style={[styles.pad, { marginTop: 6 }]}>
          <Text style={styles.sectionTitle}>Tus retos</Text>

          <View style={{ marginTop: 12, gap: 12 }}>
            {CHALLENGES.map((c) => (
              <GlassCard key={c.id} style={styles.challengeCard}>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowTop}>
                    <Text style={styles.tag}>{c.tag.toUpperCase()}</Text>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>{c.status}</Text>
                    </View>
                  </View>

                  <Text style={styles.challengeTitle}>{c.title}</Text>
                  <Text style={styles.challengeDesc}>{c.desc}</Text>
                </View>

                <MaterialIcons name="chevron-right" size={24} color="rgba(255,255,255,0.25)" />
              </GlassCard>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Stitch.colors.bg },
  header: { paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 },
  h1: { color: "#fff", fontSize: 24, fontWeight: "900" },
  pad: { paddingHorizontal: 16 },

  heroWrap: {
    height: 240,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  heroImg: { ...StyleSheet.absoluteFillObject, width: undefined, height: undefined },
  heroContent: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 16 },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(33,196,93,0.18)",
    borderWidth: 1,
    borderColor: "rgba(33,196,93,0.28)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },
  badgeText: {
    color: Stitch.colors.primary,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "900" },
  heroSub: { color: "rgba(255,255,255,0.70)", fontSize: 13, fontWeight: "600", marginTop: 6 },

  heroBtnRow: { marginTop: 14, gap: 8 },
  heroBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Stitch.colors.primary,
  },
  heroBtnText: { color: Stitch.colors.bg, fontWeight: "900", fontSize: 14 },
  heroHint: { color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: "600" },

  sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "900" },

  challengeCard: {
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  tag: {
    color: Stitch.colors.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  statusText: { color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: "800" },

  challengeTitle: { color: "#fff", fontSize: 14, fontWeight: "900", marginTop: 8 },
  challengeDesc: { color: "rgba(255,255,255,0.60)", fontSize: 12, fontWeight: "600", marginTop: 4 },
});

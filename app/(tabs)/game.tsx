import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { GlassCard } from "../../components/ui/GlassCard";
import { Stitch } from "../../constants/theme";

/* ───────────────────────────────────────────────
   URL DEL JUEGO  –  Cambia esta URL por el build
   Unity WebGL cuando se pueda descargar y listo.
   ─────────────────────────────────────────────── */
const GAME_URL = "https://plays.org/game/recycle-hero/?utm_source=chatgpt.com";

const HERO =
  "https://images.unsplash.com/photo-1520975958221-19c5d6f1b4e1?auto=format&fit=crop&w=1200&q=60";

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

/* ── Pantalla completa del juego (WebView) ──── */
function GameWebView({ onClose }: { onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const webviewRef = useRef<any>(null);

  /* Timeout: si después de 20s sigue "cargando", quitamos el overlay */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) setLoading(false);
    }, 20_000);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    webviewRef.current?.reload();
  };

  return (
    <View style={[styles.gameContainer, { paddingTop: insets.top }]}>  
      <StatusBar barStyle="light-content" />

      {/* Barra superior */}
      <View style={styles.gameBar}>
        <Pressable onPress={onClose} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" />
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.gameBarTitle}>Oracúlo-Juego</Text>

        <Pressable
          onPress={handleRetry}
          style={styles.reloadBtn}
        >
          <MaterialIcons name="refresh" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* WebView (móvil) o iframe (web) con el juego */}
      <View style={{ flex: 1 }}>
        {Platform.OS === "web" ? (
          <iframe
            src={GAME_URL}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: Stitch.colors.bg,
            }}
            allow="autoplay; fullscreen; gyroscope; accelerometer"
            allowFullScreen
            onLoad={() => setLoading(false)}
          />
        ) : (
          <WebView
            ref={webviewRef}
            source={{ uri: GAME_URL }}
            style={{ flex: 1, backgroundColor: Stitch.colors.bg }}
            onLoad={() => setLoading(false)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onHttpError={() => {
              setLoading(false);
              setError(true);
            }}
            /* Permite touch & gestos dentro del juego */
            originWhitelist={["*"]}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            scalesPageToFit={Platform.OS === "android"}
            startInLoadingState={false}
            cacheEnabled
            thirdPartyCookiesEnabled
            userAgent={
              Platform.OS === "android"
                ? "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                : undefined
            }
            /* Viewport correcto para el juego */
            injectedJavaScript={`
              const meta = document.createElement('meta');
              meta.name = 'viewport';
              meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
              document.head.appendChild(meta);
              true;
            `}
          />
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Stitch.colors.primary} />
            <Text style={styles.loadingText}>Cargando juego…</Text>
          </View>
        )}

        {error && !loading && (
          <View style={styles.loadingOverlay}>
            <MaterialIcons name="error-outline" size={48} color="rgba(255,255,255,0.4)" />
            <Text style={styles.errorTitle}>No se pudo cargar el juego</Text>
            <Text style={styles.errorSub}>
              El sitio podría estar bloqueando la carga dentro de la app.
            </Text>
            <Pressable style={styles.retryBtn} onPress={handleRetry}>
              <MaterialIcons name="refresh" size={18} color={Stitch.colors.bg} />
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
            <Pressable
              style={styles.openBrowserBtn}
              onPress={() => Linking.openURL(GAME_URL)}
            >
              <MaterialIcons name="open-in-new" size={16} color={Stitch.colors.primary} />
              <Text style={styles.openBrowserText}>Abrir en navegador</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

/* ── Pantalla principal: Retos + Hero ───────── */
export default function ChallengesScreen() {
  const [playing, setPlaying] = useState(false);

  /* Si el usuario toca "Jugar", mostramos el WebView a pantalla completa */
  if (playing) {
    return <GameWebView onClose={() => setPlaying(false)} />;
  }

  return (
    <View style={styles.screen}>
      <LoginModal visible={loginModalVisible} onDismiss={dismissLogin} onSuccess={onLoginSuccess} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.h1}>Retos</Text>
        </View>

        {/* HERO: Jugar */}
        <View style={styles.pad}>
          <Pressable style={styles.heroWrap} onPress={() => setPlaying(true)}>
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

                <Text style={styles.heroHint}>Toca para iniciar el juego</Text>
              </View>
            </View>
          </Pressable>
        </View>

        {/* LISTA: Retos */}
        <View style={[styles.pad, { marginTop: 6 }]}>
          <Text style={styles.sectionTitle}>Tus retos</Text>

          <View style={{ marginTop: 12, gap: 12 }}>
            {CHALLENGES.map((c) => (
              <Pressable key={c.id} onPress={() => requireAuth(() => {})}>
                <GlassCard style={styles.challengeCard}>
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
              </Pressable>
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

  /* ── Estilos del WebView / juego ── */
  gameContainer: {
    flex: 1,
    backgroundColor: Stitch.colors.bg,
  },
  gameBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  gameBarTitle: { color: "#fff", fontSize: 15, fontWeight: "900" },
  reloadBtn: {
    padding: 6,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Stitch.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: "600" },
  errorTitle: { color: "#fff", fontSize: 17, fontWeight: "900", textAlign: "center" },
  errorSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 32,
    marginTop: 4,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    backgroundColor: Stitch.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  retryText: { color: Stitch.colors.bg, fontWeight: "900", fontSize: 14 },
  openBrowserBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  openBrowserText: { color: Stitch.colors.primary, fontWeight: "700", fontSize: 13 },
});

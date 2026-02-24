import { API_BASE } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ActivityEvent = {
  type: string;
  refType: "article" | "routine" | "challenge" | "quiz";
  refId: string;
  meta?: Record<string, any>;
  at: string;
};

export default function MyActivityScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    if (!token) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/activity/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!alive) return;

        if (!res.ok) {
          setEvents([]);
          return;
        }

        setEvents(data.events || []);
      } catch {
        if (!alive) return;
        setEvents([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token]);

  function goTo(refType: string, refId: string) {
    if (refType === "article") router.push(`/articles/${refId}`);
    if (refType === "routine") router.push(`/routines/${refId}`);
    if (refType === "challenge") router.push(`/challenges/${refId}`);
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mi actividad</Text>
          <Text style={styles.subtitle}>
            Tu historial reciente dentro de la app.
          </Text>
        </View>

        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: loading ? "rgba(255,255,255,0.45)" : "#13EC5B" },
            ]}
          />
          <Text style={styles.statusText}>
            {loading ? "Sync…" : "Al día"}
          </Text>
        </View>
      </View>

      <Text style={styles.section}>Reciente</Text>

      {loading ? (
        <Text style={styles.muted}>Cargando…</Text>
      ) : events.length === 0 ? (
        <Text style={styles.muted}>Aún no hay actividad registrada.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(it, idx) => `${it.type}-${it.refId}-${idx}`}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <View style={styles.timelineRow}>
              {/* rail */}
              <View style={styles.timelineLeft}>
                <View style={styles.dot} />
                {index !== events.length - 1 && <View style={styles.rail} />}
              </View>

              <View style={styles.eventCard}>
                <View style={styles.eventTop}>
                  <View style={styles.eventIcon}>
                    <MaterialIcons
                      name={iconForEvent(item)}
                      size={18}
                      color="#13EC5B"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowTitle}>
                      {humanize(item)}
                    </Text>
                    <Text style={styles.rowMeta}>
                      {new Date(item.at).toLocaleString()}
                    </Text>
                  </View>

                  <Pressable onPress={() => goTo(item.refType, item.refId)}>
                    <Text style={styles.link}>Ver</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

function iconForEvent(e: ActivityEvent): keyof typeof MaterialIcons.glyphMap {
  switch (e.type) {
    case "article_started":
      return "menu-book";
    case "article_completed":
      return "task-alt";
    case "quiz_submitted":
      return "quiz";
    case "routine_started":
      return "fitness-center";
    case "routine_completed":
      return "emoji-events";
    case "challenge_started":
      return "flag";
    case "challenge_completed":
      return "military-tech";
    default:
      return "history";
  }
}

function humanize(e: ActivityEvent) {
  switch (e.type) {
    case "article_started":
      return "Empezaste un artículo";
    case "article_completed":
      return "Completaste un artículo";
    case "quiz_submitted":
      return "Enviaste un quiz";
    case "routine_started":
      return "Empezaste una rutina";
    case "routine_completed":
      return "Completaste una rutina";
    case "challenge_started":
      return "Empezaste un reto";
    case "challenge_completed":
      return "Completaste un reto";
    default:
      return e.type;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 22, fontWeight: "800", color: "#fff" },
  subtitle: { marginTop: 4, color: "rgba(255,255,255,0.60)" },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  statusDot: { width: 8, height: 8, borderRadius: 999 },
  statusText: { color: "rgba(255,255,255,0.75)", fontWeight: "700", fontSize: 12 },

  section: { marginTop: 16, marginBottom: 10, color: "rgba(255,255,255,0.70)", fontWeight: "700" },
  muted: { color: "rgba(255,255,255,0.6)" },

  timelineRow: { flexDirection: "row", gap: 12 },
  timelineLeft: { width: 18, alignItems: "center" },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(19,236,91,0.90)",
    marginTop: 16,
  },
  rail: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginTop: 6,
    marginBottom: 6,
  },

  eventCard: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "rgba(18,18,24,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  eventTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  eventIcon: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: "rgba(19,236,91,0.12)",
    borderWidth: 1,
    borderColor: "rgba(19,236,91,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { color: "#fff", fontWeight: "800" },
  rowMeta: { color: "rgba(255,255,255,0.6)", marginTop: 2, fontSize: 12 },
  link: { color: "#13EC5B", fontWeight: "900" },
});
import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";


type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export default function AchievementsScreen() {
  const achievements = useMemo<Achievement[]>(
    () => [
      {
        id: "a1",
        title: "Primer paso",
        description: "Entraste a la app por primera vez.",
        unlocked: true,
      },
      {
        id: "a2",
        title: "Constancia",
        description: "Completaste 3 sesiones en la semana.",
        unlocked: false,
      },
      {
        id: "a3",
        title: "Explorador/a",
        description: "Visitaste la sección Descubrir.",
        unlocked: true,
      },
    ],
    []
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logros</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Progreso</Text>
        <Text style={styles.summaryValue}>
          {unlockedCount} / {achievements.length} desbloqueados
        </Text>
      </View>

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.unlocked && styles.cardLocked]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={[styles.badge, item.unlocked ? styles.badgeOn : styles.badgeOff]}>
                {item.unlocked ? "Desbloqueado" : "Bloqueado"}
              </Text>
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#15151D",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  summaryValue: {
    color: "#D946EF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#15151D",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardLocked: {
    opacity: 0.55,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  cardDesc: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  badgeOn: {
    color: "#0B0B0F",
    backgroundColor: "#D946EF",
    fontWeight: "700",
  },
  badgeOff: {
    color: "#E5E7EB",
    backgroundColor: "#2A2A35",
    fontWeight: "600",
  },
});

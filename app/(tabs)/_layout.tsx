// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stitch } from "../../constants/theme";

const INACTIVE = "rgba(255,255,255,0.40)";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const BASE_HEIGHT = 72; // tu diseño actual
  const PAD_TOP = 10;
  const PAD_BOTTOM_DESIGN = 12;

  // ✅ evita que quede pegado incluso si insets.bottom=0 (algunos dispositivos/estados)
  const safeBottom = Math.max(insets.bottom, PAD_BOTTOM_DESIGN);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
        tabBarActiveTintColor: Stitch.colors.primary,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: "rgba(5,5,5,0.85)",
          borderTopColor: "rgba(255,255,255,0.05)",
          borderTopWidth: 1,

          // ✅ claves:
          paddingTop: PAD_TOP,
          paddingBottom: safeBottom,
          height: BASE_HEIGHT + (safeBottom - PAD_BOTTOM_DESIGN),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Descubrir",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="explore" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: "Retos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="flag" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: "Logros",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="emoji-events" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },

        tabBarActiveTintColor: "#D946EF", // morado/fucsia (ajústalo a tu exacto)
        tabBarInactiveTintColor: "#6B7280", // gris

        tabBarStyle: {
          backgroundColor: "#0B0B0F",
          borderTopColor: "rgba(255,255,255,0.08)",
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size ?? 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: "Descubrir",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="search" size={size ?? 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="achievements"
        options={{
          title: "Logros",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="bar-chart" size={size ?? 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size ?? 26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

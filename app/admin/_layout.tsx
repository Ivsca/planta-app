// app/admin/_layout.tsx
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(tabs)/profile");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/(tabs)");
      return;
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  if (isLoading) return null;

  return <Stack screenOptions={{ headerShown: false, title: "Administrador" }} />;
}
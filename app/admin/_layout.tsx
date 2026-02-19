import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // No autenticado => fuera
    if (!isAuthenticated) {
      router.replace("/(tabs)/profile");
      return;
    }

    // No admin => fuera
    if (user?.role !== "admin") {
      router.replace("/(tabs)");
      return;
    }
  }, [isAuthenticated, user?.role, router]);

  return <Stack screenOptions={{ headerShown: true, title: "Administrador" }} />;
}

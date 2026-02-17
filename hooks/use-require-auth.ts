import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Hook que verifica si el usuario está autenticado antes de
 * ejecutar una acción. Si no está logueado, muestra el modal
 * de login en su lugar.
 *
 * Uso:
 *   const { requireAuth, loginModalVisible, dismissLogin } = useRequireAuth();
 *   <Pressable onPress={() => requireAuth(() => navigation.navigate("Game"))}>
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action();
      } else {
        setPendingAction(() => action);
        setLoginModalVisible(true);
      }
    },
    [isAuthenticated]
  );

  const dismissLogin = useCallback(() => {
    setLoginModalVisible(false);
    setPendingAction(null);
  }, []);

  /** Llamar después de login exitoso para ejecutar la acción pendiente */
  const onLoginSuccess = useCallback(() => {
    setLoginModalVisible(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  return { requireAuth, loginModalVisible, dismissLogin, onLoginSuccess };
}

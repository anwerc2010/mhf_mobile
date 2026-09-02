import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { API_CONFIG } from "../constants/config";

export function useFcmToken(): void {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribeTokenRefresh: (() => void) | null = null;

    async function registerToken(token: string) {
      try {
        await fetch(`${API_CONFIG.BASE_URL}/customer/save-fcm-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ fcm_token: token }),
        });
      } catch {
        // Silently fail — backend will receive token on next login
      }
    }

    async function initFcm() {
      const authStatus = await messaging().requestPermission();
      const granted =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!granted) return;

      const token = await messaging().getToken();
      if (token) {
        await registerToken(token);
      }

      unsubscribeTokenRefresh = messaging().onTokenRefresh(registerToken);
    }

    initFcm();

    return () => {
      unsubscribeTokenRefresh?.();
    };
  }, [isAuthenticated, authToken]);
}

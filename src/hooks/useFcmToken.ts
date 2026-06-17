import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { useSelector } from "react-redux";
import { useSaveNotificationTokenMutation } from "@psi/shared-api";
import { RootState } from "../store/store";

export function useFcmToken(): void {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [saveNotificationToken] = useSaveNotificationTokenMutation();

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsubscribeTokenRefresh: (() => void) | null = null;

    async function registerToken(token: string) {
      try {
        await saveNotificationToken({ notification_token: token });
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
  }, [isAuthenticated, saveNotificationToken]);
}

import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCopilot } from "react-native-copilot";
import { GUIDE_VERSION } from "../config/guideConfig";
import { useAppSelector } from "../store/hook";

const GUIDE_STORAGE_PREFIX = `guide_${GUIDE_VERSION}_`;

const TESTING_MODE = false;

/**
 * Custom hook that controls walkthrough guide lifecycle per screen.
 *
 * - Automatically starts the guide on first visit
 * - Stores completion state in AsyncStorage (version-aware)
 * - Skips guide on subsequent visits
 *
 * @param screenName - Unique screen identifier matching guideConfig keys
 */
export const useGuideController = (screenName: string) => {
  const { start } = useCopilot();
  const isAuthenticated = useAppSelector(
    (state) => (state.auth as any)?.isAuthenticated as boolean,
  );
  const userId = useAppSelector((state) => (state.auth as any)?.user?.id);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthenticated) {
        return;
      }

      const normalizedUserId = userId != null ? String(userId) : "unknown-user";
      const storageKey = `${GUIDE_STORAGE_PREFIX}${normalizedUserId}_${screenName}`;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const startGuide = () => {
        timer = setTimeout(() => {
          void start();
        }, 800);
      };

      const runGuide = async () => {
        try {
          if (TESTING_MODE) {
            startGuide();
            return;
          }

          const seen = await AsyncStorage.getItem(storageKey);

          if (!seen) {
            // Delay to allow screen layout to complete before starting guide
            startGuide();

            await AsyncStorage.setItem(storageKey, "true");
          }
        } catch {
          // Silently fail — guide is non-critical UX
        }
      };

      void runGuide();

      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }, [isAuthenticated, screenName, start, userId]),
  );
};

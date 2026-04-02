import React, { createContext, useContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GUIDE_VERSION } from "../config/guideConfig";

interface GuideContextType {
  /** Currently active screen for guide */
  currentScreen: string | null;
  /** Set the active screen */
  setCurrentScreen: (screen: string | null) => void;
  /** Reset guide for a specific screen (for testing) */
  resetGuide: (screenName: string) => Promise<void>;
  /** Reset all guides across the app */
  resetAllGuides: () => Promise<void>;
}

const GuideContext = createContext<GuideContextType>({
  currentScreen: null,
  setCurrentScreen: () => {},
  resetGuide: async () => {},
  resetAllGuides: async () => {},
});

const GUIDE_STORAGE_PREFIX = `guide_${GUIDE_VERSION}_`;

export const GuideProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentScreen, setCurrentScreen] = useState<string | null>(null);

  const resetGuide = useCallback(async (screenName: string) => {
    await AsyncStorage.removeItem(`${GUIDE_STORAGE_PREFIX}${screenName}`);
  }, []);

  const resetAllGuides = useCallback(async () => {
    const keys = await AsyncStorage.getAllKeys();
    const guideKeys = keys.filter((key) =>
      key.startsWith(GUIDE_STORAGE_PREFIX),
    );
    for (const key of guideKeys) {
      await AsyncStorage.removeItem(key);
    }
  }, []);

  return (
    <GuideContext.Provider
      value={{ currentScreen, setCurrentScreen, resetGuide, resetAllGuides }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export const useGuide = () => useContext(GuideContext);

export { GUIDE_STORAGE_PREFIX };

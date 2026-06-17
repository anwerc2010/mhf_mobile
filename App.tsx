import "react-native-gesture-handler";
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  I18nManager,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useSelector, useDispatch } from "react-redux";
import { CopilotProvider } from "react-native-copilot";
import { store, RootState } from "./src/store/store";
import { setCurrentTheme } from "./src/store/slices/themeSlice";
import RootNavigator from "./src/navigation/RootNavigator";
import NetworkStatusBanner from "./src/components/general/NetworkStatusBanner";
import GuideTooltip from "./src/components/general/GuideTooltip";
import { GuideProvider } from "./src/context/GuideContext";
import "./src/i18n";
import React, { useEffect } from "react";
import { bootstrapAuth } from "./src/services/authBootstrap";
import { useAppDispatch } from "./src/store/hook";
import { useFcmToken } from "./src/hooks/useFcmToken";

// Circular spotlight mask with per-step sizing.
const circularGuideMaskPath = ({ size, position, canvasSize, step }: any) => {
  const positionX = size?.x?._value != null ? position.x._value : 0;
  const positionY = size?.y?._value != null ? position.y._value : 0;
  const sizeX = size?.x?._value != null ? size.x._value : 0;
  const sizeY = size?.y?._value != null ? size.y._value : 0;

  const cx = positionX + sizeX / 2;
  const cy = positionY + sizeY / 2;
  const isHomeApplyCardStep = step?.name === "home_apply_card";
  const baseRadius = Math.max(sizeX, sizeY) / 2;
  const paddedRadius = baseRadius + (isHomeApplyCardStep ? 6 : 14);
  const radius = isHomeApplyCardStep
    ? Math.min(paddedRadius, 92)
    : paddedRadius;

  return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0ZM${
    cx - radius
  },${cy}a${radius},${radius} 0 1,0 ${radius * 2},0a${radius},${radius} 0 1,0 ${
    -radius * 2
  },0Z`;
};

function AppContent() {
  const systemColorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const currentLanguage = useSelector(
    (state: RootState) => state.language.currentLanguage,
  );
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme,
  );

  useFcmToken();

  // Restore persisted auth session on every app launch (including after swipe-kill)
  useEffect(() => {
    bootstrapAuth(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (themeMode === "system" && systemColorScheme) {
      dispatch(
        setCurrentTheme(systemColorScheme === "dark" ? "dark" : "light"),
      );
    }
  }, [systemColorScheme, themeMode, dispatch]);

  useEffect(() => {
    const isRTL = currentLanguage === "ar";
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);
  }, [currentLanguage]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CopilotProvider
        tooltipComponent={GuideTooltip}
        svgMaskPath={circularGuideMaskPath}
        stepNumberComponent={() => null}
        labels={{
          previous: "Previous",
          next: "Next",
          skip: "Skip",
          finish: "Finish",
        }}
        tooltipStyle={{
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <GuideProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
              <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
              <NetworkStatusBanner />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </GuideProvider>
      </CopilotProvider>
    </GestureHandlerRootView>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

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
import { store, RootState } from "./src/store/store";
import { setCurrentTheme } from "./src/store/slices/themeSlice";
import RootNavigator from "./src/navigation/RootNavigator";
import NetworkStatusBanner from "./src/components/general/NetworkStatusBanner";
import "./src/i18n";
import React, { useEffect } from "react";
import { bootstrapAuth } from "./src/services/authBootstrap";
import { useAppDispatch } from "./src/store/hook";

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
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <NetworkStatusBanner />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
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

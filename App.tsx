
import 'react-native-gesture-handler';
import { StatusBar, StyleSheet, useColorScheme, SafeAreaView, I18nManager } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './src/store/store';
import { setCurrentTheme } from './src/store/slices/themeSlice';
import RootNavigator from './src/navigation/RootNavigator';
import NetworkStatusBanner from './src/components/general/NetworkStatusBanner';
import './src/i18n'; // Initialize i18n
import React, { useEffect } from 'react';

function AppContent() {
  const systemColorScheme = useColorScheme();
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const currentTheme = useSelector((state: RootState) => state.theme.currentTheme);

  // Initialize theme from system preference
  useEffect(() => {
    if (themeMode === 'system' && systemColorScheme) {
      dispatch(setCurrentTheme(systemColorScheme === 'dark' ? 'dark' : 'light'));
    }
  }, [systemColorScheme, themeMode, dispatch]);

  // Update RTL layout when language changes
  useEffect(() => {
    const isRTL = currentLanguage === 'ar';
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);
  }, [currentLanguage]);

  const isDarkMode = currentTheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <SafeAreaView style={{ flex: 1 }}>
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

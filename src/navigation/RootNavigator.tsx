import React from "react";
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import AppNavigator from "./AppNavigator";
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";
import ForgotPasswordScreen from "../screens/ForgotPassword";
import ResetPasswordScreen from "../screens/ResetPassword";
import TermsScreen from "../screens/Terms";

const Stack = createNativeStackNavigator();

function SplashScreen() {
  return (
    <View style={styles.splash}>
      <Image
        source={require("../../assets/images/logo-hd.png")}
        style={styles.splashLogo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#020050" style={styles.spinner} />
    </View>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function AppNavigatorWrapper() {
  return <AppNavigator />;
}

/**
 * RootNavigator uses React Navigation's conditional-screens pattern.
 *
 * Phases:
 *   isSessionRestoring = true  → show SplashScreen while AsyncStorage read or
 *                                 token-refresh is in progress
 *   authenticated + terms due  → only Terms screen is mounted
 *   authenticated + terms ok   → only App navigator is mounted
 *   not authenticated          → only Login stack is mounted
 */
export default function RootNavigator() {
  const isSessionRestoring = useSelector(
    (state: RootState) => (state.auth as any).isSessionRestoring as boolean,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => (state.auth as any).isAuthenticated as boolean,
  );
  const termsRequired = useSelector(
    (state: RootState) => state.legal.termsRequired,
  );

  // Show splash while the bootstrap async check runs
  if (isSessionRestoring) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={AuthNavigator} />
      ) : termsRequired ? (
        <Stack.Screen
          name="Terms"
          component={TermsScreen}
          options={{ gestureEnabled: false, animation: "fade" }}
        />
      ) : (
        <Stack.Screen name="App" component={AppNavigatorWrapper} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  splashLogo: {
    width: 140,
    height: 140,
  },
  spinner: {
    marginTop: 32,
  },
});

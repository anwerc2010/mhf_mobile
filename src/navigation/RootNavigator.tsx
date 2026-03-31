import React from "react";
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
 * Only the screen relevant to the current auth/terms state exists in the
 * stack at any time — navigation bypass is structurally impossible:
 *
 *   not authenticated          → only Login stack is mounted
 *   authenticated + terms due  → only Terms screen is mounted
 *   authenticated + terms ok   → only App navigator is mounted
 *
 * React Navigation automatically transitions when Redux state changes.
 * No imperative reset/dispatch calls are required.
 */
export default function RootNavigator() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.token !== null,
  );
  const termsRequired = useSelector(
    (state: RootState) => state.legal.termsRequired,
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // ── Pre-auth ──────────────────────────────────────────────────────────
        <Stack.Screen name="Login" component={AuthNavigator} />
      ) : termsRequired ? (
        // ── Terms gate ────────────────────────────────────────────────────────
        // gestureEnabled:false + BackHandler inside TermsScreen ensure
        // the user cannot leave without accepting.
        <Stack.Screen
          name="Terms"
          component={TermsScreen}
          options={{ gestureEnabled: false, animation: "fade" }}
        />
      ) : (
        // ── Main app ──────────────────────────────────────────────────────────
        <Stack.Screen name="App" component={AppNavigatorWrapper} />
      )}
    </Stack.Navigator>
  );
}

import React, { useState, useEffect, use } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  I18nManager,
  ImageBackground,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  loginSuccess,
  logout,
  useLoginMutation,
  useSaveNotificationTokenMutation,
} from "@psi/shared-api";
import { useLazyGetTermsVersionQuery } from "../api/legalApi";
import { setLegalTermsRequired } from "../store/slices/legalSlice";
import { logger } from "../utils/logger";
import { spacing } from "../constants/spacing";
import PTButton from "../components/comman/PTButton";
import PTInput from "../components/comman/PTInput";
import PTText from "../components/comman/PTText";
import LanguageSwitcher from "../components/general/LanguageSwitcher";
import ThemeSwitcher from "../components/general/ThemeSwitcher";
import {
  getMessaging,
  getToken,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";


interface LoginScreenProps {
  navigation: any;
}

export async function requestUserPermission() {
  try {
    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Notification permission granted");
    }
    return enabled;
  } catch (error) {
    console.log("Error requesting notification permission:", error);
    return false;
  }
}

export async function getFCMToken() {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.log("Error getting FCM token:", error);
    return null;
  }
}

function LoginScreen({ navigation }: LoginScreenProps) {
  const { width, height } = useWindowDimensions();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage,
  );
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState(""); //('Test@123');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [loginMutation, { isLoading, error }] = useLoginMutation();
  const [saveNotificationToken] = useSaveNotificationTokenMutation();
  const [triggerGetTermsVersion] = useLazyGetTermsVersionQuery();

  useEffect(() => {
    const setupFirebase = async () => {
      try {
        const hasPermission = await requestUserPermission();
        if (hasPermission) {
          const token = await getFCMToken();
          setFcmToken(token);
        }
      } catch (error) {
        console.log("Firebase setup error:", error);
      }
    };

    setupFirebase();
  }, []);

  // Update RTL layout when language changes
  useEffect(() => {
    const isRTL = currentLanguage === "ar" || currentLanguage === "ur";
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);

    // Note: App restart may be required for RTL changes to take full effect on Android
  }, [currentLanguage]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        t("login.loginFailed"),
        "data" in error
          ? (error.data as { message?: string })?.message ||
              t("login.invalidCredentials")
          : t("login.errorOccurred"),
      );
    }
  }, [error, t]);

  const handleLogin = async () => {
    if (!loginInput || !password) {
      Alert.alert(t("common.error"), t("login.fillAllFields"));
      return;
    }

    try {
      const result = await loginMutation({
        login: loginInput,
        password,
      }).unwrap();
      if (!result.access_token || !result.customer) {
        Alert.alert(t("login.loginFailed"), t("login.invalidCredentials"));
        return;
      }

      dispatch(
        loginSuccess({
          token: result.access_token,
          refreshToken: result.refresh_token ?? null,
          expiryTimestamp: result.expires_in
            ? Date.now() + result.expires_in * 1000
            : null,
          user: result.customer,
        }),
      );

      const tokenToSave = fcmToken || (await getFCMToken());
      if (tokenToSave) {
        try {
          await saveNotificationToken({
            notification_token: tokenToSave,
          }).unwrap();
        } catch (saveTokenError) {
          logger.error("Failed to save notification token:", saveTokenError);
        }
      }

      // Verify terms version — BLOCKING: user must not enter the app if this fails
      try {
        const versionData = await triggerGetTermsVersion().unwrap();
        const customerAny = result.customer as any;
        if (customerAny.terms_version !== versionData.version) {
          dispatch(
            setLegalTermsRequired({
              required: true,
              serverVersion: versionData.version,
            }),
          );
        } else {
          dispatch(setLegalTermsRequired({ required: false }));
        }
        // RootNavigator's conditional screens handle navigation based on the state above
      } catch (termsError) {
        // Terms check failed — clear auth and block the user (legal compliance)
        dispatch(logout());
        Alert.alert(
          "Connection Error",
          "Unable to verify Terms & Conditions. Please check your internet connection and try again.",
        );
        logger.error("Terms version check failed:", termsError);
        return; // ⛔ stop — RootNavigator will redirect to Login because token is cleared
      }
    } catch (err) {
      // Error is handled by useEffect above
      logger.error("Login error:", err);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={[styles.backgroundImage, { width, height }]}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.content}>
            <Image
              source={require("../../assets/images/logo-hd.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <PTText variant="h1" style={styles.title}>
              {t("login.title")}
            </PTText>

            <View style={styles.form}>
              <PTInput
                label={t(
                  "login.loginLabel",
                  "Email /Phone / Aadhaar / Membership ID HC-2026-123456",
                )}
                placeholder={t(
                  "login.loginPlaceholder",
                  "Enter phone, aadhaar or HC-XXXXX",
                )}
                value={loginInput}
                onChangeText={setLoginInput}
                autoCapitalize="none"
                autoComplete="email"
              />

              <PTInput
                label={t("common.password")}
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                showPasswordToggle
                autoCapitalize="none"
                autoComplete="password"
              />

              <View style={styles.forgotPasswordContainer}>
                <Text
                  style={styles.forgotPasswordLink}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  {t("login.forgotPassword", "Forgot Password?")}
                </Text>
              </View>

              <View style={styles.button}>
                <PTButton
                  title={t("common.signIn")}
                  variant="success"
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={!loginInput || !password}
                />
              </View>

              <View style={styles.footer}>
                <PTText variant="body" style={styles.footerText}>
                  {t("login.noAccount")}{" "}
                </PTText>
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate("Register")}
                >
                  {t("common.signUp")}
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 40,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
    color: "#020050ff",
    fontWeight: "700",
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 16,
    width: "60%",
    alignSelf: "center",
    color: "#4d9734ff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#666",
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginBottom: 8,
  },
  forgotPasswordLink: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default LoginScreen;

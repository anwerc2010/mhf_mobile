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
} from "react-native";
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
import { isValidEmail } from "../utils/validator";
import { logger } from "../utils/logger";
import { spacing } from "../constants/spacing";
import PTButton from "../components/comman/PTButton";
import PTInput from "../components/comman/PTInput";
import PTContainer from "../components/comman/PTContainer";
import PTText from "../components/comman/PTText";
import LanguageSwitcher from "../components/general/LanguageSwitcher";
import ThemeSwitcher from "../components/general/ThemeSwitcher";
import messaging from "@react-native-firebase/messaging";

interface LoginScreenProps {
  navigation: any;
}

export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

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
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.log("Error getting FCM token:", error);
    return null;
  }
}

function LoginScreen({ navigation }: LoginScreenProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage,
  );
  const [email, setEmail] = useState(""); //('customer101@gmail.com');
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
    if (!email || !password) {
      Alert.alert(t("common.error"), t("login.fillAllFields"));
      return;
    }

    // Validate email using config
    if (!isValidEmail(email)) {
      Alert.alert(t("common.error"), t("login.invalidCredentials"));
      return;
    }

    try {
      const result = await loginMutation({ email, password }).unwrap();
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
    <PTContainer safeArea>
      <ImageBackground
        source={require("../../assets/images/background.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
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
                label={t("common.email")}
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                  disabled={!email || !password}
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
      </ImageBackground>
    </PTContainer>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
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
    justifyContent: "center",
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

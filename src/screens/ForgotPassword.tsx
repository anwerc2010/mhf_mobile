import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSendOtpMutation } from "@psi/shared-api";
import { isValidEmail } from "../utils/validator";
import { logger } from "../utils/logger";
import { spacing } from "../constants/spacing";
import PTButton from "../components/comman/PTButton";
import PTInput from "../components/comman/PTInput";
import PTContainer from "../components/comman/PTContainer";
import PTText from "../components/comman/PTText";

interface ForgotPasswordScreenProps {
  navigation: any;
}

function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sendOtpMutation, { isLoading, error }] = useSendOtpMutation();

  useEffect(() => {
    if (!error) {
      return;
    }

    const message =
      "data" in error
        ? (error.data as { message?: string })?.message ||
          t(
            "forgotPassword.errorMessage",
            "Failed to send OTP. Please try again.",
          )
        : t(
            "forgotPassword.errorMessage",
            "Failed to send OTP. Please try again.",
          );

    Alert.alert(t("common.error"), message);
  }, [error, t]);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert(
        t("common.error"),
        t("forgotPassword.enterEmail", "Please enter your email address"),
      );
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert(
        t("common.error"),
        t("forgotPassword.invalidEmail", "Please enter a valid email address"),
      );
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await sendOtpMutation({ email: normalizedEmail }).unwrap();

      if (result?.error) {
        const apiMessage =
          result?.message ||
          t(
            "forgotPassword.errorMessage",
            "Failed to send OTP. Please try again.",
          );
        Alert.alert(t("common.error"), apiMessage);
        return;
      }

      logger.info("OTP sent for password reset:", normalizedEmail);

      Alert.alert(
        t("forgotPassword.success", "Success"),
        result?.message ||
          t("forgotPassword.successMessage", "OTP sent to your email address."),
        [
          {
            text: t("common.ok"),
            onPress: () =>
              navigation.navigate("ResetPassword", {
                email: normalizedEmail,
                otpSent: true,
              }),
          },
        ],
      );
    } catch (err) {
      logger.error("Forgot password error:", err);

      const message =
        typeof err === "object" && err && "data" in (err as any)
          ? ((err as any).data as { message?: string })?.message ||
            t(
              "forgotPassword.errorMessage",
              "Failed to send OTP. Please try again.",
            )
          : t(
              "forgotPassword.errorMessage",
              "Failed to send OTP. Please try again.",
            );

      Alert.alert(t("common.error"), message);
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
            {/* <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← {t('common.back', 'Back')}</Text>
            </TouchableOpacity> */}

            <Image
              source={require("../../assets/images/logo-hd.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <PTText variant="h1" style={styles.title}>
              {t("forgotPassword.title", "Forgot Password")}
            </PTText>

            <PTText variant="body" style={styles.subtitle}>
              {t(
                "forgotPassword.subtitle",
                "Enter your email address and we'll send you a one-time password (OTP) to reset your password.",
              )}
            </PTText>

            <View style={styles.form}>
              <PTInput
                label={t("common.email")}
                placeholder={t(
                  "forgotPassword.emailPlaceholder",
                  "Enter your email",
                )}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <View style={styles.button}>
                <PTButton
                  title={t("forgotPassword.sendInstructions", "Send OTP")}
                  variant="success"
                  onPress={handleSendOtp}
                  loading={isLoading}
                  disabled={!email}
                />
              </View>

              <View style={styles.footer}>
                <PTText variant="body" style={styles.footerText}>
                  {t(
                    "forgotPassword.rememberPassword",
                    "Remember your password?",
                  )}{" "}
                </PTText>
                <Text style={styles.link} onPress={() => navigation.goBack()}>
                  {t("common.signIn", "Sign In")}
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
  subtitle: {
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
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
});

export default ForgotPasswordScreen;

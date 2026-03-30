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
import {
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@psi/shared-api";
import { logger } from "../utils/logger";
import { spacing } from "../constants/spacing";
import { isValidEmail } from "../utils/validator";
import PTButton from "../components/comman/PTButton";
import PTInput from "../components/comman/PTInput";
import PTContainer from "../components/comman/PTContainer";
import PTText from "../components/comman/PTText";

interface ResetPasswordScreenProps {
  navigation: any;
  route?: {
    params?: {
      email?: string;
      otpSent?: boolean;
    };
  };
}

function ResetPasswordScreen({ navigation, route }: ResetPasswordScreenProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState(route?.params?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(Boolean(route?.params?.otpSent));
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [sendOtpMutation, { isLoading: isSendingOtp, error: sendOtpError }] =
    useSendOtpMutation();
  const [
    verifyOtpMutation,
    { isLoading: isVerifyingOtp, error: verifyOtpError },
  ] = useVerifyOtpMutation();
  const [
    resetPasswordMutation,
    { isLoading: isResettingPassword, error: resetPasswordError },
  ] = useResetPasswordMutation();

  useEffect(() => {
    const mutationError = sendOtpError || verifyOtpError || resetPasswordError;
    if (!mutationError) {
      return;
    }

    const message =
      "data" in mutationError
        ? (mutationError.data as { message?: string })?.message ||
          t(
            "resetPassword.errorMessage",
            "Failed to process password reset request. Please try again.",
          )
        : t(
            "resetPassword.errorMessage",
            "Failed to process password reset request. Please try again.",
          );

    Alert.alert(t("common.error"), message);
  }, [sendOtpError, verifyOtpError, resetPasswordError, t]);

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert(
        t("common.error"),
        t("forgotPassword.enterEmail", "Please enter your email address"),
      );
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      Alert.alert(
        t("common.error"),
        t("forgotPassword.invalidEmail", "Please enter a valid email address"),
      );
      return;
    }

    try {
      const result = await sendOtpMutation({ email: normalizedEmail }).unwrap();
      if (result?.error) {
        Alert.alert(
          t("common.error"),
          result?.message ||
            t(
              "resetPassword.sendOtpFailed",
              "Failed to send OTP. Please try again.",
            ),
        );
        return;
      }

      setEmail(normalizedEmail);
      setIsOtpSent(true);
      Alert.alert(
        t("resetPassword.success", "Success"),
        result?.message || t("resetPassword.otpSent", "OTP sent successfully."),
      );
    } catch (err) {
      logger.error("Send OTP error:", err);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.trim();
    if (!otpValue) {
      Alert.alert(
        t("common.error"),
        t("resetPassword.enterOtp", "Please enter OTP"),
      );
      return;
    }

    try {
      const result = await verifyOtpMutation({ otp: otpValue }).unwrap();
      if (result?.error) {
        Alert.alert(
          t("common.error"),
          result?.message ||
            t(
              "resetPassword.verifyOtpFailed",
              "Invalid OTP. Please try again.",
            ),
        );
        return;
      }

      setIsOtpVerified(true);
      Alert.alert(
        t("resetPassword.success", "Success"),
        result?.message ||
          t("resetPassword.otpVerified", "OTP verified successfully."),
      );
    } catch (err) {
      logger.error("Verify OTP error:", err);
    }
  };

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !otp.trim() || !newPassword || !confirmPassword) {
      Alert.alert(
        t("common.error"),
        t("resetPassword.fillAllFields", "Please fill in all fields"),
      );
      return;
    }

    if (!isOtpVerified) {
      Alert.alert(
        t("common.error"),
        t(
          "resetPassword.verifyOtpFirst",
          "Please verify OTP before resetting password",
        ),
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        t("common.error"),
        t(
          "resetPassword.passwordTooShort",
          "Password must be at least 6 characters long",
        ),
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        t("common.error"),
        t("resetPassword.passwordMismatch", "Passwords do not match"),
      );
      return;
    }

    try {
      const result = await resetPasswordMutation({
        email: normalizedEmail,
        password: newPassword,
        password_confirmation: confirmPassword,
      }).unwrap();

      if (result?.error) {
        Alert.alert(
          t("common.error"),
          result?.message ||
            t(
              "resetPassword.errorMessage",
              "Failed to reset password. Please try again.",
            ),
        );
        return;
      }

      logger.info("Password reset successful");

      Alert.alert(
        t("resetPassword.success", "Success"),
        result?.message ||
          t(
            "resetPassword.successMessage",
            "Your password has been reset successfully. Please login with your new password.",
          ),
        [{ text: t("common.ok"), onPress: () => navigation.navigate("Login") }],
      );
    } catch (err) {
      logger.error("Reset password error:", err);
      const message =
        typeof err === "object" && err && "data" in (err as any)
          ? ((err as any).data as { message?: string })?.message ||
            t(
              "resetPassword.errorMessage",
              "Failed to reset password. Please try again.",
            )
          : t(
              "resetPassword.errorMessage",
              "Failed to reset password. Please try again.",
            );
      Alert.alert(t("common.error"), message);
    }
  };

  const submitTitle = !isOtpSent
    ? t("resetPassword.sendOtp", "Send OTP")
    : !isOtpVerified
    ? t("resetPassword.verifyOtp", "Verify OTP")
    : t("resetPassword.resetPassword", "Reset Password");

  const handlePrimaryAction = () => {
    if (!isOtpSent) {
      handleSendOtp();
      return;
    }

    if (!isOtpVerified) {
      handleVerifyOtp();
      return;
    }

    handleResetPassword();
  };

  const isPrimaryLoading =
    isSendingOtp || isVerifyingOtp || isResettingPassword;
  const isPrimaryDisabled = !isOtpSent
    ? !email
    : !isOtpVerified
    ? !otp
    : !newPassword || !confirmPassword;

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
              {t("resetPassword.title", "Reset Password")}
            </PTText>

            <PTText variant="body" style={styles.subtitle}>
              {t(
                "resetPassword.subtitle",
                "Send OTP, verify OTP, then choose a new password.",
              )}
            </PTText>

            <View style={styles.form}>
              <PTInput
                label={t("common.email", "Email")}
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

              {isOtpSent && (
                <PTInput
                  label={t("resetPassword.otp", "OTP")}
                  placeholder={t("resetPassword.otpPlaceholder", "Enter OTP")}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
              )}

              {isOtpVerified && (
                <>
                  <PTInput
                    label={t("resetPassword.newPassword", "New Password")}
                    placeholder={t(
                      "resetPassword.newPasswordPlaceholder",
                      "Enter new password",
                    )}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />

                  <PTInput
                    label={t(
                      "resetPassword.confirmPassword",
                      "Confirm Password",
                    )}
                    placeholder={t(
                      "resetPassword.confirmPasswordPlaceholder",
                      "Confirm new password",
                    )}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                  />
                </>
              )}

              <View style={styles.button}>
                <PTButton
                  title={submitTitle}
                  variant="success"
                  onPress={handlePrimaryAction}
                  loading={isPrimaryLoading}
                  disabled={isPrimaryDisabled}
                />
              </View>

              {isOtpSent && !isOtpVerified && (
                <View style={styles.secondaryButton}>
                  <PTButton
                    title={t("resetPassword.resendOtp", "Resend OTP")}
                    variant="outline"
                    onPress={handleSendOtp}
                    disabled={isPrimaryLoading}
                  />
                </View>
              )}

              <View style={styles.footer}>
                <PTText variant="body" style={styles.footerText}>
                  {t("resetPassword.backToLogin", "Back to")}{" "}
                </PTText>
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate("Login")}
                >
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
  secondaryButton: {
    marginTop: 10,
    width: "60%",
    alignSelf: "center",
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

export default ResetPasswordScreen;

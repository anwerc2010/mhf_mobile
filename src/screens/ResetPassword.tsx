import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  Image,
  ScrollView,
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

const OTP_LENGTH = 6;

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
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill(""),
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(Boolean(route?.params?.otpSent));
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const otpInputRefs = useRef<(TextInput | null)[]>([]);

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

  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "");
    const newDigits = [...otpDigits];
    newDigits[index] = digit.slice(-1);
    setOtpDigits(newDigits);

    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const getOtpString = () => otpDigits.join("");

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
    const otpValue = getOtpString();
    if (otpValue.length !== OTP_LENGTH) {
      Alert.alert(
        t("common.error"),
        t("resetPassword.enterOtp", "Please enter the complete OTP"),
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
    } catch (err) {
      logger.error("Verify OTP error:", err);
    }
  };

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const otpValue = getOtpString();

    if (!newPassword || !confirmPassword) {
      Alert.alert(
        t("common.error"),
        t("resetPassword.fillAllFields", "Please fill in all fields"),
      );
      return;
    }

    if (otpValue.length !== OTP_LENGTH) {
      Alert.alert(
        t("common.error"),
        t("resetPassword.enterOtp", "Please enter the complete OTP"),
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
        otp: otpValue,
        password: newPassword,
        password_confirmation: confirmPassword,
      } as any).unwrap();

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

  // Step indicators
  const currentStep = !isOtpSent ? 1 : !isOtpVerified ? 2 : 3;

  const stepTitle =
    currentStep === 2
      ? t("resetPassword.enterOtpTitle", "Enter OTP")
      : t("resetPassword.title", "Reset Password");

  const stepSubtitle =
    currentStep === 2
      ? t(
          "resetPassword.enterOtpSubtitle",
          "We sent an OTP to your email. Please check and enter below to verify.",
        )
      : t(
          "resetPassword.resetSubtitle",
          "Please enter your registered Email to reset your password.",
        );

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.stepRow}>
          <View
            style={[
              styles.stepDot,
              currentStep >= step && styles.stepDotActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= step && styles.stepNumberActive,
              ]}
            >
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderOtpInputs = () => (
    <View style={styles.otpContainer}>
      <PTText variant="caption" style={styles.otpLabel}>
        {t("resetPassword.enterOtpLabel", "Enter OTP")}
      </PTText>
      <View style={styles.otpRow}>
        {otpDigits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              otpInputRefs.current[index] = ref;
            }}
            style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleOtpKeyPress(nativeEvent.key, index)
            }
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>
      <View style={styles.resendContainer}>
        <Text
          style={styles.resendLink}
          onPress={isSendingOtp ? undefined : handleSendOtp}
        >
          {t("resetPassword.resendOtp", "Resend")}
        </Text>
      </View>
    </View>
  );

  const renderPasswordFields = () => (
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
        showPasswordToggle
        autoCapitalize="none"
        autoComplete="password-new"
      />

      <PTInput
        label={t("resetPassword.confirmPassword", "Confirm Password")}
        placeholder={t(
          "resetPassword.confirmPasswordPlaceholder",
          "Confirm new password",
        )}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        showPasswordToggle
        autoCapitalize="none"
        autoComplete="password-new"
      />
    </>
  );

  const handlePrimaryAction = () => {
    if (currentStep === 2) {
      handleVerifyOtp();
    } else if (currentStep === 3) {
      handleResetPassword();
    }
  };

  const primaryButtonTitle =
    currentStep === 2
      ? t("resetPassword.verify", "Verify")
      : t("resetPassword.resetPassword", "Reset Password");

  const isPrimaryLoading = isVerifyingOtp || isResettingPassword;
  const isPrimaryDisabled =
    currentStep === 2
      ? getOtpString().length !== OTP_LENGTH
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <Image
                source={require("../../assets/images/logo-hd.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <PTText variant="h1" style={styles.title}>
                {stepTitle}
              </PTText>

              <PTText variant="body" style={styles.subtitle}>
                {stepSubtitle}
              </PTText>

              {renderStepIndicator()}

              <View style={styles.form}>
                {/* Email shown as read-only context */}
                {isOtpSent && (
                  <PTInput
                    label={t("common.email", "Email")}
                    value={email}
                    editable={false}
                    onChangeText={() => {}}
                  />
                )}

                {/* Step 2: OTP digit boxes */}
                {isOtpSent && !isOtpVerified && renderOtpInputs()}

                {/* Step 3: Password fields */}
                {isOtpVerified && renderPasswordFields()}

                <View style={styles.button}>
                  <PTButton
                    title={primaryButtonTitle}
                    variant="success"
                    onPress={handlePrimaryAction}
                    loading={isPrimaryLoading}
                    disabled={isPrimaryDisabled}
                  />
                </View>

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
          </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: "#4d9734",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#999",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLine: {
    width: 40,
    height: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: "#4d9734",
  },
  form: {
    width: "100%",
  },
  otpContainer: {
    marginBottom: 12,
  },
  otpLabel: {
    marginBottom: 8,
    fontWeight: "600",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpBox: {
    width: 48,
    height: 52,
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#020050",
    backgroundColor: "#fff",
  },
  otpBoxFilled: {
    borderColor: "#4d9734",
  },
  resendContainer: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  resendLink: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
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

export default ResetPasswordScreen;

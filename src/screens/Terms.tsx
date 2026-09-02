import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  BackHandler,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { useAcceptTermsMutation } from "../api/legalApi";
import { setLegalTermsRequired } from "../store/slices/legalSlice";
import { spacing } from "../constants/spacing";
import { useTheme } from "../hooks/useTheme";
import TermsAccordion from "../components/general/TermsAccordion";
import { useTranslation } from "react-i18next";

export default function TermsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const serverTermsVersion = useAppSelector(
    (state) => state.legal.serverTermsVersion,
  );
  const [agreed, setAgreed] = useState(false);
  const [acceptTerms, { isLoading }] = useAcceptTermsMutation();

  // Block Android hardware back button â€” user must accept to continue
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => subscription.remove();
  }, []);

  const handleAccept = async () => {
    if (!agreed || isLoading) return;

    try {
      await acceptTerms({ version: serverTermsVersion ?? "" }).unwrap();
      // Dispatching false removes the Terms screen from the stack immediately.
      // RootNavigator's conditional-screens render mounts the App screen next.
      dispatch(setLegalTermsRequired({ required: false }));
    } catch (err: any) {
      const raw = err?.data?.message;
      let message = t(
        "terms.acceptError",
        "Failed to accept terms. Please check your connection and try again.",
      );
      if (typeof raw === "string") {
        message = raw;
      } else if (raw && typeof raw === "object") {
        const keys = Object.keys(raw);
        if (keys.length > 0) {
          const val = raw[keys[0]];
          message = `${keys[0]}: ${Array.isArray(val) ? val[0] : val}`;
        }
      }
      Alert.alert(t("common.error"), String(message));
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Icon */}
        <View style={styles.iconRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.colors.primary + "15" },
            ]}
          >
            <Text style={styles.iconEmoji}>ðŸ“‹</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={[styles.heading, { color: theme.colors.text }]}>
          {t("terms.beforeContinue", "Before You Continue")}
        </Text>

        <Text
          style={[styles.subheading, { color: theme.colors.textSecondary }]}
        >
          {t(
            "terms.reviewPrompt",
            "Please review and accept our Terms & Conditions to use MH Foundation services.",
          )}
        </Text>

        {/* Accordion */}
        <TermsAccordion value={agreed} onChange={setAgreed} />
      </ScrollView>

      {/* Sticky Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.acceptButton,
            {
              backgroundColor: agreed
                ? theme.colors.primary
                : theme.colors.backgroundTertiary,
            },
          ]}
          onPress={handleAccept}
          disabled={!agreed || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text
              style={[
                styles.acceptButtonText,
                {
                  color: agreed ? "#FFFFFF" : theme.colors.textSecondary,
                },
              ]}
            >
              {t("terms.acceptContinue", "Accept & Continue")}
            </Text>
          )}
        </TouchableOpacity>

        <Text
          style={[styles.footerNote, { color: theme.colors.textSecondary }]}
        >
          {t("terms.mustAccept", "You must accept to continue using the app")}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  iconRow: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 36,
  },
  heading: {
    fontSize: 21,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subheading: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  acceptButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  footerNote: {
    fontSize: 12,
    textAlign: "center",
  },
});

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { spacing } from "../../../constants/spacing";
import { useTranslation } from "react-i18next";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const NGO_TERMS_POINTS_FALLBACK = [
  "You will provide accurate and complete information.",
  "You are responsible for maintaining your account security.",
  "Services are provided for charitable and non-commercial use only.",
  "You will not misuse or disrupt the platform.",
  "Our team will follow up with you within 24 hours.",
  "Your personal and health data will be handled as per our Privacy Policy.",
  "Services are provided on a best-effort basis and availability is not guaranteed.",
  "We may suspend accounts that violate these terms.",
];

interface TermsAccordionProps {
  /** Whether the agreement checkbox is checked */
  value: boolean;
  /** Called whenever the checkbox is toggled */
  onChange: (agreed: boolean) => void;
}

export default function TermsAccordion({
  value,
  onChange,
}: TermsAccordionProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const ngoTermsPoints = NGO_TERMS_POINTS_FALLBACK.map((fallback, index) =>
    t(`terms.points.${index}`, fallback),
  );

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setExpanded((prev) => !prev);
  };

  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: value ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      {/* ── Header row ── */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={t(
          "terms.accessibilityLabel",
          "Terms and Conditions",
        )}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: theme.colors.primary + "18" },
            ]}
          >
            <Text style={styles.iconText}>📋</Text>
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {t("terms.title", "Terms & Conditions")}
          </Text>
        </View>

        <Animated.Text
          style={[
            styles.arrow,
            { color: theme.colors.primary },
            { transform: [{ rotate: arrowRotation }] },
          ]}
        >
          ▼
        </Animated.Text>
      </TouchableOpacity>

      {/* ── Expanded body ── */}
      {expanded && (
        <View style={styles.body}>
          <Text
            style={[styles.introText, { color: theme.colors.textSecondary }]}
          >
            {t(
              "terms.intro",
              "By using MH Foundation services, you agree to the following:",
            )}
          </Text>

          {/* Bullet points */}
          {ngoTermsPoints.map((point, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color: theme.colors.primary }]}>
                •
              </Text>
              <Text style={[styles.bulletText, { color: theme.colors.text }]}>
                {point}
              </Text>
            </View>
          ))}

          {/* Divider */}
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.colors.borderLight },
            ]}
          />

          {/* Agreement checkbox row */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => onChange(!value)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: value }}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: theme.colors.primary },
                value && { backgroundColor: theme.colors.primary },
              ]}
            >
              {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, { color: theme.colors.text }]}>
              {t(
                "terms.checkboxLabel",
                "I have read and agree to the Terms & Conditions and Privacy Policy.",
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Collapsed hint when not yet agreed */}
      {!expanded && !value && (
        <Text
          style={[styles.collapsedHint, { color: theme.colors.textSecondary }]}
        >
          {t("terms.collapsedHint", "Tap to review and agree")}
        </Text>
      )}

      {/* Agreed indicator when collapsed */}
      {!expanded && value && (
        <View style={styles.agreedRow}>
          <Text style={[styles.agreedText, { color: theme.colors.success }]}>
            ✓ {t("terms.agreed", "You have agreed to the Terms & Conditions")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  arrow: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  introText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.sm,
    fontStyle: "italic",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingRight: 4,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: 8,
    fontWeight: "700",
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 21,
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 1,
    flexShrink: 0,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  collapsedHint: {
    fontSize: 12,
    paddingHorizontal: spacing.md,
    paddingBottom: 10,
  },
  agreedRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: 10,
  },
  agreedText: {
    fontSize: 13,
    fontWeight: "600",
  },
});

import React from "react";
import { Text, StyleSheet, Linking, Alert } from "react-native";
import { APP_CONFIG } from "../../../constants/config";
import { useTheme } from "../../../hooks/useTheme";

interface LegalLinksProps {
  style?: object;
}

export default function LegalLinks({ style }: LegalLinksProps) {
  const theme = useTheme();

  const openURL = (url: string, label: string) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
        Alert.alert("Error", `Unable to open ${label}.`);
      })
      .catch(() => Alert.alert("Error", `Unable to open ${label}.`));
  };

  return (
    <Text style={[styles.text, style]}>
      <Text
        style={[styles.link, { color: theme.colors.primary }]}
        onPress={() =>
          openURL(APP_CONFIG.TERMS_OF_SERVICE_URL, "Terms & Conditions")
        }
      >
        Terms & Conditions
      </Text>
      <Text style={{ color: theme.colors.textSecondary }}> and </Text>
      <Text
        style={[styles.link, { color: theme.colors.primary }]}
        onPress={() => openURL(APP_CONFIG.PRIVACY_POLICY_URL, "Privacy Policy")}
      >
        Privacy Policy
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

interface TermsCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function TermsCheckbox({
  checked,
  onToggle,
  children,
}: TermsCheckboxProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        style={[
          styles.checkbox,
          { borderColor: theme.colors.primary },
          checked && { backgroundColor: theme.colors.primary },
        ]}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={styles.labelContainer}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    marginTop: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  labelContainer: {
    flex: 1,
  },
});

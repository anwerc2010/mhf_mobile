import React, { useState } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Eye, EyeSlash } from "phosphor-react-native";
import { useTheme } from "../../../hooks/useTheme";
import PTText from "../PTText";

interface PTInputProps extends TextInputProps {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export default function PTInput({
  label,
  error,
  style,
  secureTextEntry,
  showPasswordToggle = false,
  ...props
}: PTInputProps) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const shouldShowToggle = showPasswordToggle && Boolean(secureTextEntry);
  const resolvedSecureTextEntry = shouldShowToggle
    ? !isPasswordVisible
    : secureTextEntry;

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      {label && (
        <PTText
          variant="caption"
          color="text"
          style={{ marginBottom: theme.spacing.sm, fontWeight: "600" }}
        >
          {label}
        </PTText>
      )}
      <View>
        <TextInput
          style={[
            {
              borderWidth: 1,
              borderColor: error ? theme.colors.error : theme.colors.border,
              borderRadius: theme.borderRadius.md,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.inputPadding,
              paddingRight: shouldShowToggle ? 44 : theme.spacing.md,
              fontSize: 16,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
            },
            error && { borderColor: theme.colors.error },
            style,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          secureTextEntry={resolvedSecureTextEntry}
          {...props}
        />

        {shouldShowToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            style={{
              position: "absolute",
              right: 12,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          >
            {isPasswordVisible ? (
              <EyeSlash size={20} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <PTText
          variant="caption"
          color="error"
          style={{ marginTop: theme.spacing.xs }}
        >
          {error}
        </PTText>
      )}
    </View>
  );
}

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';
import PTButton from '../PTButton';

interface PTEmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function PTEmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  style,
}: PTEmptyStateProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme.spacing.xl,
        },
        style,
      ]}
    >
      {icon && (
        <View style={{ marginBottom: theme.spacing.lg }}>
          {icon}
        </View>
      )}
      
      <PTText
        variant="h3"
        color="text"
        style={{
          marginBottom: message ? theme.spacing.sm : theme.spacing.md,
          textAlign: 'center',
        }}
      >
        {title}
      </PTText>

      {message && (
        <PTText
          variant="body"
          color="textSecondary"
          style={{
            marginBottom: actionLabel ? theme.spacing.lg : 0,
            textAlign: 'center',
          }}
        >
          {message}
        </PTText>
      )}

      {actionLabel && onAction && (
        <PTButton title={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}


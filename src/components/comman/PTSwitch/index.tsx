import React from 'react';
import { Switch, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function PTSwitch({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
}: PTSwitchProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        style,
      ]}
    >
      {label && (
        <PTText variant="body" color="text" style={{ flex: 1, marginRight: theme.spacing.md }}>
          {label}
        </PTText>
      )}
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.colors.border,
          true: theme.colors.primary,
        }}
        thumbColor={value ? theme.colors.textInverse : theme.colors.textTertiary}
        ios_backgroundColor={theme.colors.border}
      />
    </View>
  );
}


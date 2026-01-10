import React from 'react';
import { View, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTStepperProps {
  /**
   * Current value
   */
  value: number;

  /**
   * Minimum value
   */
  min?: number;

  /**
   * Maximum value
   */
  max?: number;

  /**
   * Step increment/decrement
   */
  step?: number;

  /**
   * Callback when value changes
   */
  onValueChange: (value: number) => void;

  /**
   * Whether stepper is disabled
   */
  disabled?: boolean;

  /**
   * Custom style
   */
  style?: ViewStyle;

  /**
   * Show label
   */
  label?: string;
}

export default function PTStepper({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  style,
  label,
}: PTStepperProps) {
  const theme = useTheme();

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onValueChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onValueChange(newValue);
  };

  const isDecrementDisabled = disabled || value <= min;
  const isIncrementDisabled = disabled || value >= max;

  return (
    <View style={style}>
      {label && (
        <PTText
          variant="caption"
          color="text"
          style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}
        >
          {label}
        </PTText>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          onPress={handleDecrement}
          disabled={isDecrementDisabled}
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: isDecrementDisabled
              ? theme.colors.backgroundSecondary
              : theme.colors.surface,
            minWidth: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <PTText
            variant="h3"
            color={isDecrementDisabled ? 'textTertiary' : 'text'}
            style={{ fontSize: 20 }}
          >
            −
          </PTText>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surface,
            minHeight: 48,
          }}
        >
          <PTText variant="h3" color="text">
            {value}
          </PTText>
        </View>

        <TouchableOpacity
          onPress={handleIncrement}
          disabled={isIncrementDisabled}
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            backgroundColor: isIncrementDisabled
              ? theme.colors.backgroundSecondary
              : theme.colors.surface,
            minWidth: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <PTText
            variant="h3"
            color={isIncrementDisabled ? 'textTertiary' : 'text'}
            style={{ fontSize: 20 }}
          >
            +
          </PTText>
        </TouchableOpacity>
      </View>
    </View>
  );
}


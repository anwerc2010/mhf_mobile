import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTBadgeProps {
  count: number | string;
  maxCount?: number;
  variant?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  showZero?: boolean;
  style?: ViewStyle;
}

export default function PTBadge({
  count,
  maxCount = 99,
  variant = 'error',
  size = 'medium',
  showZero = false,
  style,
}: PTBadgeProps) {
  const theme = useTheme();

  if (!showZero && (count === 0 || count === '0')) {
    return null;
  }

  const displayCount =
    typeof count === 'number' && count > maxCount ? `${maxCount}+` : String(count);

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'error':
        return theme.colors.error;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      default:
        return theme.colors.error;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          minWidth: 16,
          height: 16,
          paddingHorizontal: 4,
          fontSize: 10,
        };
      case 'large':
        return {
          minWidth: 24,
          height: 24,
          paddingHorizontal: 6,
          fontSize: 14,
        };
      default: // medium
        return {
          minWidth: 20,
          height: 20,
          paddingHorizontal: 5,
          fontSize: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        {
          backgroundColor: getVariantColor(),
          borderRadius: theme.borderRadius.round,
          minWidth: sizeStyles.minWidth,
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <PTText
        variant="caption"
        color="textInverse"
        style={{
          fontSize: sizeStyles.fontSize,
          fontWeight: '700',
          lineHeight: sizeStyles.fontSize,
        }}
      >
        {displayCount}
      </PTText>
    </View>
  );
}


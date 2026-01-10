import React from 'react';
import { View, ViewStyle, Animated } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTProgressBarProps {
  /**
   * Progress value (0-100)
   */
  progress: number;

  /**
   * Height of the progress bar
   */
  height?: number;

  /**
   * Background color variant
   */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';

  /**
   * Whether to show percentage text
   */
  showPercentage?: boolean;

  /**
   * Whether to animate the progress
   */
  animated?: boolean;

  /**
   * Custom style
   */
  style?: ViewStyle;

  /**
   * Custom track style
   */
  trackStyle?: ViewStyle;

  /**
   * Custom fill style
   */
  fillStyle?: ViewStyle;
}

export default function PTProgressBar({
  progress,
  height = 8,
  variant = 'primary',
  showPercentage = false,
  animated = true,
  style,
  trackStyle,
  fillStyle,
}: PTProgressBarProps) {
  const theme = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: Math.min(Math.max(progress, 0), 100),
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(Math.min(Math.max(progress, 0), 100));
    }
  }, [progress, animated, animatedValue]);

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning || '#FF9500';
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const width = animated
    ? animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
      })
    : `${Math.min(Math.max(progress, 0), 100)}%`;

  return (
    <View style={style}>
      {showPercentage && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing.xs,
          }}
        >
          <PTText variant="caption" color="textSecondary">
            Progress
          </PTText>
          <PTText variant="caption" color="textSecondary">
            {Math.round(Math.min(Math.max(progress, 0), 100))}%
          </PTText>
        </View>
      )}
      <View
        style={[
          {
            height,
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: height / 2,
            overflow: 'hidden',
          },
          trackStyle,
        ]}
      >
        {animated ? (
          <Animated.View
            style={[
              {
                height: '100%',
                backgroundColor: getVariantColor(),
                borderRadius: height / 2,
                width,
              },
              fillStyle,
            ]}
          />
        ) : (
          <View
            style={[
              {
                height: '100%',
                backgroundColor: getVariantColor(),
                borderRadius: height / 2,
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              },
              fillStyle,
            ]}
          />
        )}
      </View>
    </View>
  );
}


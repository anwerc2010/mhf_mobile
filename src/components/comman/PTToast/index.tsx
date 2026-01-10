import React, { useEffect } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { UI_CONFIG } from '../../../constants/config';
import PTText from '../PTText';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface PTToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  position?: 'top' | 'bottom';
}

export default function PTToast({
  visible,
  message,
  type = 'info',
  duration = UI_CONFIG.TOAST_DURATION,
  onClose,
  position = 'top',
}: PTToastProps) {
  const theme = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        [position]: 50,
        left: theme.spacing.md,
        right: theme.spacing.md,
        zIndex: 9999,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity
        onPress={hideToast}
        activeOpacity={0.9}
        style={{
          backgroundColor: getTypeColor(),
          borderRadius: theme.borderRadius.md,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          ...theme.shadows.lg,
        }}
      >
        <PTText variant="body" color="textInverse" style={{ textAlign: 'center' }}>
          {message}
        </PTText>
      </TouchableOpacity>
    </Animated.View>
  );
}


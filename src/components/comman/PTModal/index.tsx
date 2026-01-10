import React from 'react';
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  style?: ViewStyle;
}

export default function PTModal({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = 'fade',
  transparent = true,
  style,
}: PTModalProps) {
  const theme = useTheme();

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.overlay,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.lg,
          }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.xl,
                  padding: theme.spacing.lg,
                  width: '100%',
                  maxWidth: 400,
                  ...theme.shadows.lg,
                },
                style,
              ]}
            >
              {(title || showCloseButton) && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: title ? theme.spacing.md : 0,
                  }}
                >
                  {title && (
                    <PTText variant="h3" color="text" style={{ flex: 1 }}>
                      {title}
                    </PTText>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      style={{
                        padding: theme.spacing.xs,
                        marginLeft: theme.spacing.sm,
                      }}
                      activeOpacity={0.7}
                    >
                      <PTText variant="h3" color="textSecondary">
                        ×
                      </PTText>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}


import React, { useState } from 'react';
import { View, ViewStyle, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTTooltipProps {
  /**
   * Tooltip content/text
   */
  content: string;

  /**
   * Child element that triggers the tooltip
   */
  children: React.ReactNode;

  /**
   * Tooltip position
   */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Whether tooltip is visible (controlled)
   */
  visible?: boolean;

  /**
   * Callback when visibility changes
   */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * Custom style
   */
  style?: ViewStyle;
}

export default function PTTooltip({
  content,
  children,
  position = 'top',
  visible: controlledVisible,
  onVisibleChange,
  style,
}: PTTooltipProps) {
  const theme = useTheme();
  const [internalVisible, setInternalVisible] = useState(false);

  const isControlled = controlledVisible !== undefined;
  const visible = isControlled ? controlledVisible : internalVisible;

  const handleToggle = () => {
    const newVisible = !visible;
    if (!isControlled) {
      setInternalVisible(newVisible);
    }
    if (onVisibleChange) {
      onVisibleChange(newVisible);
    }
  };

  const handleClose = () => {
    if (!isControlled) {
      setInternalVisible(false);
    }
    if (onVisibleChange) {
      onVisibleChange(false);
    }
  };

  const getTooltipStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows?.md || {},
      maxWidth: 200,
      zIndex: 1000,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          bottom: '100%',
          marginBottom: theme.spacing.xs,
          alignSelf: 'center',
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: '100%',
          marginTop: theme.spacing.xs,
          alignSelf: 'center',
        };
      case 'left':
        return {
          ...baseStyle,
          right: '100%',
          marginRight: theme.spacing.xs,
          alignSelf: 'center',
        };
      case 'right':
        return {
          ...baseStyle,
          left: '100%',
          marginLeft: theme.spacing.xs,
          alignSelf: 'center',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[{ position: 'relative' }, style]}>
      <TouchableOpacity onPress={handleToggle} activeOpacity={1}>
        {children}
      </TouchableOpacity>

      {visible && (
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={handleClose}
        >
          <TouchableWithoutFeedback onPress={handleClose}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <View style={getTooltipStyle()}>
                  <PTText variant="caption" color="text" style={{ textAlign: 'center' }}>
                    {content}
                  </PTText>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}


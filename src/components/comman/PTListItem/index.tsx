import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';
import PTAvatar from '../PTAvatar';
import PTBadge from '../PTBadge';

interface PTListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  avatar?: { uri: string } | number | string;
  badge?: number | string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function PTListItem({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  avatar,
  badge,
  onPress,
  disabled = false,
  style,
}: PTListItemProps) {
  const theme = useTheme();

  const content = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.borderLight,
        },
        style,
      ]}
    >
      {/* Left side - Avatar or Icon */}
      {avatar && (
        <PTAvatar
          source={typeof avatar === 'string' ? { uri: avatar } : avatar}
          name={title}
          size={40}
          style={{ marginRight: theme.spacing.md }}
        />
      )}
      {leftIcon && !avatar && (
        <View style={{ marginRight: theme.spacing.md }}>{leftIcon}</View>
      )}

      {/* Center - Title and Subtitle */}
      <View style={{ flex: 1 }}>
        <PTText variant="body" color="text" style={{ marginBottom: subtitle ? theme.spacing.xs : 0 }}>
          {title}
        </PTText>
        {subtitle && (
          <PTText variant="caption" color="textSecondary">
            {subtitle}
          </PTText>
        )}
      </View>

      {/* Right side - Badge and Icon */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {badge !== undefined && <PTBadge count={badge} style={{ marginRight: theme.spacing.sm }} />}
        {rightIcon && <View>{rightIcon}</View>}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}


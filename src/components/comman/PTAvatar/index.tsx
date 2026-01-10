import React from 'react';
import { View, Image, ViewStyle, ImageStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTAvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: number;
  variant?: 'circle' | 'rounded' | 'square';
  style?: ViewStyle;
}

export default function PTAvatar({
  source,
  name,
  size = 40,
  variant = 'circle',
  style,
}: PTAvatarProps) {
  const theme = useTheme();

  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getBorderRadius = () => {
    switch (variant) {
      case 'circle':
        return size / 2;
      case 'rounded':
        return theme.borderRadius.md;
      case 'square':
        return 0;
      default:
        return size / 2;
    }
  };

  const backgroundColor = source
    ? 'transparent'
    : theme.colors.primary;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: getBorderRadius(),
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: getBorderRadius(),
          }}
          resizeMode="cover"
        />
      ) : (
        <PTText
          variant="body"
          color="textInverse"
          style={{
            fontSize: size * 0.4,
            fontWeight: '700',
          }}
        >
          {getInitials(name)}
        </PTText>
      )}
    </View>
  );
}


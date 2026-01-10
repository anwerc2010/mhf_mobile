import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface PTDividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
  style?: ViewStyle;
}

export default function PTDivider({
  orientation = 'horizontal',
  spacing = 0,
  style,
}: PTDividerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.borderLight,
          ...(orientation === 'horizontal'
            ? {
                height: 1,
                width: '100%',
                marginVertical: spacing,
              }
            : {
                width: 1,
                height: '100%',
                marginHorizontal: spacing,
              }),
        },
        style,
      ]}
    />
  );
}


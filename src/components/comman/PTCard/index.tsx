import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface PTCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export default function PTCard({ children, style }: PTCardProps) {
    const theme = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.lg,
                    padding: theme.spacing.cardPadding,
                    ...theme.shadows.md,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}


import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface PTTextProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
    bold?: boolean;
    color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textTertiary' | 'error' | 'success';
}

export default function PTText({
    variant = 'body',
    bold = false,
    color = 'text',
    style,
    ...props
}: PTTextProps) {
    const theme = useTheme();

    const getColor = () => {
        switch (color) {
            case 'primary':
                return theme.colors.primary;
            case 'secondary':
                return theme.colors.secondary;
            case 'text':
                return theme.colors.text;
            case 'textSecondary':
                return theme.colors.textSecondary;
            case 'textTertiary':
                return theme.colors.textTertiary;
            case 'error':
                return theme.colors.error;
            case 'success':
                return theme.colors.success;
            default:
                return theme.colors.text;
        }
    };

    const variantStyles = {
        h1: {
            fontSize: 32,
            fontWeight: '700' as const,
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: '700' as const,
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            lineHeight: 24,
        },
        caption: {
            fontSize: 12,
            lineHeight: 16,
        },
    };

    return (
        <Text
            style={[
                {
                    color: getColor(),
                },
                variantStyles[variant],
                bold && { fontWeight: '700' as const },
                style,
            ]}
            {...props}
        />
    );
}


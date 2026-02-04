import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface PTButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'success';
}

export default function PTButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
}: PTButtonProps) {
    const theme = useTheme();

    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return { backgroundColor: theme.colors.primary };
            case 'secondary':
                return { backgroundColor: theme.colors.secondary };
            case 'success':
                return { backgroundColor: theme.colors.success };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                };
            default:
                return { backgroundColor: theme.colors.primary };
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'primary':
            case 'secondary':
                return { color: theme.colors.textInverse };
            case 'outline':
                return { color: theme.colors.primary };
            default:
                return { color: theme.colors.textInverse };
        }
    };

    return (
        <TouchableOpacity
            style={[
                {
                    paddingVertical: theme.spacing.buttonPadding,
                    paddingHorizontal: theme.spacing.lg,
                    borderRadius: theme.borderRadius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 48,
                },
                getButtonStyle(),
                (disabled || loading) && { opacity: 0.5 },
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={getTextStyle().color} />
            ) : (
                <Text
                    style={[
                        {
                            fontSize: 18,
                            fontWeight: '700',
                        },
                        getTextStyle(),
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}


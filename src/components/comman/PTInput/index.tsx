import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export default function PTInput({ label, error, style, ...props }: PTInputProps) {
    const theme = useTheme();

    return (
        <View style={{ marginBottom: theme.spacing.md }}>
            {label && (
                <PTText
                    variant="caption"
                    color="text"
                    style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}
                >
                    {label}
                </PTText>
            )}
            <TextInput
                style={[
                    {
                        borderWidth: 1,
                        borderColor: error ? theme.colors.error : theme.colors.border,
                        borderRadius: theme.borderRadius.md,
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.inputPadding,
                        fontSize: 16,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                    },
                    error && { borderColor: theme.colors.error },
                    style,
                ]}
                placeholderTextColor={theme.colors.textTertiary}
                {...props}
            />
            {error && (
                <PTText
                    variant="caption"
                    color="error"
                    style={{ marginTop: theme.spacing.xs }}
                >
                    {error}
                </PTText>
            )}
        </View>
    );
}


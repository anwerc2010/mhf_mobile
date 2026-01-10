import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import PTText from '../PTText';

interface PTHeaderProps {
    title: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftPress?: () => void;
    onRightPress?: () => void;
}

export default function PTHeader({
    title,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
}: PTHeaderProps) {
    const theme = useTheme();

    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm + 4,
                backgroundColor: theme.colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.borderLight,
            }}
        >
            {leftIcon && (
                <TouchableOpacity
                    style={{
                        padding: theme.spacing.sm,
                        minWidth: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={onLeftPress}
                    activeOpacity={0.7}
                >
                    {leftIcon}
                </TouchableOpacity>
            )}
            <PTText
                variant="h3"
                color="text"
                style={{
                    flex: 1,
                    textAlign: 'center',
                }}
            >
                {title}
            </PTText>
            {rightIcon && (
                <TouchableOpacity
                    style={{
                        padding: theme.spacing.sm,
                        minWidth: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={onRightPress}
                    activeOpacity={0.7}
                >
                    {rightIcon}
                </TouchableOpacity>
            )}
        </View>
    );
}


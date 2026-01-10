import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

export default function PTSpinner() {
    const theme = useTheme();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
    );
}
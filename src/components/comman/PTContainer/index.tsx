import React from 'react';
import { View, ViewStyle, SafeAreaView } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface PTContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    safeArea?: boolean;
}

export default function PTContainer({
    children,
    style,
    safeArea = false,
}: PTContainerProps) {
    const theme = useTheme();
    const Container = safeArea ? SafeAreaView : View;
    
    return (
        <Container
            style={[
                {
                    flex: 1,
                    backgroundColor: theme.colors.background,
                },
                style,
            ]}
        >
            {children}
        </Container>
    );
}


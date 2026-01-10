import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AppNavigator from './AppNavigator';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppNavigatorWrapper() {
  return <AppNavigator />;
}

function RootNavigatorContent() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.token !== null);
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to App when authenticated
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'App' as never }],
        })
      );
    } else {
      // Navigate to Login when not authenticated
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        })
      );
    }
  }, [isAuthenticated, navigation]);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isAuthenticated ? 'App' : 'Login'}
    >
      {/* Pre-auth screens */}
      <Stack.Screen name="Login" component={AuthNavigator} />
      
      {/* Post-auth: Main app navigation */}
      <Stack.Screen name="App" component={AppNavigatorWrapper} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return <RootNavigatorContent />;
}


import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/Home';
import ProfileScreen from '../screens/Profile';
import CardScreen from '../screens/Card';
import ServicesScreen from '../screens/Services';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#999',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerLabel: 'Home',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerLabel: 'Profile',
        }}
      />
      <Drawer.Screen
        name="MyCard"
        component={CardScreen}
        options={{
          title: 'My Card',
          drawerLabel: 'My Card',
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={ServicesScreen}
        options={{
          title: 'Notifications',
          drawerLabel: 'Notifications',
        }}
      />
    </Drawer.Navigator>
  );
}


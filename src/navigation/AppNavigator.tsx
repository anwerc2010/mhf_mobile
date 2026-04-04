/**
 * AppNavigator - Configurable Navigation System
 *
 * This file provides a configurable navigation system that supports:
 * 1. Stack Navigator - Standard stack-based navigation with push/pop
 * 2. Bottom Tab Navigator - Bottom tab bar navigation
 * 3. Top Tab Navigator - Top tab bar navigation (swipeable)
 * 4. Drawer Navigator - Side drawer navigation
 *
 * To switch between navigation types, modify the NAVIGATION_CONFIG.type value:
 * - 'stack' - Stack Navigator
 * - 'bottom-tabs' - Bottom Tab Navigator
 * - 'top-tabs' - Top Tab Navigator
 * - 'drawer' - Drawer Navigator
 *
 * Example:
 * const NAVIGATION_CONFIG: NavigationConfig = {
 *   type: 'bottom-tabs', // Change this to switch navigation type
 * };
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  HouseIcon,
  CreditCardIcon,
  StethoscopeIcon,
  UserIcon,
  CaretLeftIcon,
} from "phosphor-react-native";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DrawerNavigatorComponent from "./DrawerNavigator";

// Screens
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import CardScreen from "../screens/Card";
import ServicesScreen from "../screens/Services";
import ProviderDetailsScreen from "../screens/ProviderDetails";
import NotificationsScreen from "../screens/Notifications";
import ReliefScreen from "../screens/about/relief/Relief";
import EducationScreen from "../screens/about/education/Education";
import EventsScreen from "../screens/about/events/Events";
import VolunteersScreen from "../screens/about/Volunteers";
import NewCardRequest from "../screens/about/NewCardRequest";
import ApplyCardRequest from "../screens/about/ApplyCardRequest";
import RegisterForTraining from "../screens/about/education/RegisterForTraining";
import EditProfileScreen from "../screens/EditProfile";

// Components
import TopNavBar from "../components/general/TopNavBar";
import i18n, { AppLanguage, syncLanguageWithStore } from "../i18n";
import { useState } from "react";
import ApplyNewRelief from "../screens/about/relief/ApplyNewRelief";
import RegisterForEvent from "../screens/about/events/RegisterForEvent";
import EquipmentRequest from "../screens/equipment/EquipmentRequest";
import EquipmentRequestList from "../screens/equipment/EquipmentRequestList";
import AmbulanceList from "../screens/ambulance/AmbulanceList";
import BloodRequest from "../screens/blood/BloodRequest";
import PaymentScreen from "../screens/payment/PaymentScreen";
import PaymentSuccessScreen from "../screens/payment/PaymentSuccessScreen";
import PaymentHistoryScreen from "../screens/payment/PaymentHistoryScreen";

// Navigation Types
export type NavigationType = "stack" | "bottom-tabs" | "top-tabs" | "drawer";

// Navigation Configuration
export interface NavigationConfig {
  type: NavigationType;
}

// Default configuration - change this to switch navigation types
const NAVIGATION_CONFIG: NavigationConfig = {
  type: "bottom-tabs", // Options: 'stack' | 'bottom-tabs' | 'top-tabs' | 'drawer'
};

// Custom Relief Header Component
type BackButtonHeaderProps = {
  navigation: any;
  title: string;
};

function BackButtonHeader({ navigation, title }: BackButtonHeaderProps) {
  return (
    <View style={styles.reliefHeader}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <CaretLeftIcon color="#0F172A" size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      {/* Spacer to keep title centered */}
      <View style={{ width: 24 }} />
    </View>
  );
}
const styles = StyleSheet.create({
  reliefHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
});

// Stack Navigator
const Stack = createNativeStackNavigator();

function StackNavigator({
  currentLanguage,
  onLanguageChange,
}: {
  currentLanguage: AppLanguage;
  onLanguageChange: (l: AppLanguage) => void;
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <TopNavBar
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="Settings"
        component={CardScreen}
        options={{ title: "Settings" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
const BottomTab = createBottomTabNavigator();

const BottomTabStack = createNativeStackNavigator();

function BottomTabNavigator({
  currentLanguage,
  onLanguageChange,
}: {
  currentLanguage: AppLanguage;
  onLanguageChange: (l: AppLanguage) => void;
}) {
  return (
    <BottomTabStack.Navigator
      screenOptions={{
        header: () => (
          <TopNavBar
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        ),
      }}
    >
      <BottomTabStack.Screen name="BottomTabs" options={{ title: "Tabs" }}>
        {() => (
          <BottomTab.Navigator
            screenOptions={{
              tabBarActiveTintColor: "#1E3A8A",
              tabBarInactiveTintColor: "#999",
              headerShown: false,
              tabBarStyle: {
                paddingBottom: 5,
                height: 60,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "500",
              },
            }}
          >
            <BottomTab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: "Home",
                tabBarLabel: "Home",
                tabBarIcon: ({ color, size }) => (
                  <HouseIcon color={color} size={size} weight="fill" />
                ),
              }}
            />
            <BottomTab.Screen
              name="Card"
              component={CardScreen}
              options={{
                title: "Card",
                tabBarLabel: "Card",
                tabBarIcon: ({ color, size }) => (
                  <CreditCardIcon color={color} size={size} weight="fill" />
                ),
              }}
            />
            <BottomTab.Screen
              name="Services"
              component={ServicesScreen}
              options={{
                title: "Services",
                tabBarLabel: "Services",
                tabBarIcon: ({ color, size }) => (
                  <StethoscopeIcon color={color} size={size} weight="fill" />
                ),
              }}
            />
            <BottomTab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                title: "Profile",
                tabBarLabel: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <UserIcon color={color} size={size} weight="fill" />
                ),
              }}
            />
          </BottomTab.Navigator>
        )}
      </BottomTabStack.Screen>
      <BottomTabStack.Screen
        name="Relief"
        component={ReliefScreen}
        options={({ navigation }) => ({
          title: "Relief Program",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Relief Program" />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="ApplyNewRelief"
        component={ApplyNewRelief}
        options={({ navigation }) => ({
          title: "Request for Relief & Welfare",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Request for Relief & Welfare"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="Education"
        component={EducationScreen}
        options={({ navigation }) => ({
          title: "Education",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Education" />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="RegisterTraining"
        component={RegisterForTraining}
        options={({ navigation }) => ({
          title: "Education & Skill Development",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Education & Skill Development"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          title: "Edit Profile",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Edit Profile" />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="Events"
        component={EventsScreen}
        options={({ navigation }) => ({
          title: "Events",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Events" />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="RegisterForEvent"
        component={RegisterForEvent}
        options={({ navigation }) => ({
          title: "Event Registration Form",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Event Registration Form"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="Volunteers"
        component={VolunteersScreen}
        options={({ navigation }) => ({
          title: "Volunteers",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Volunteer Registration Form"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="NewCardRequest"
        component={NewCardRequest}
        options={({ navigation }) => ({
          title: "Request New Card",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Request New Card"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="ApplyCardRequest"
        component={ApplyCardRequest}
        options={({ navigation }) => ({
          title: "Apply for Card",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Apply for Card" />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="ProviderDetails"
        component={ProviderDetailsScreen}
        options={({ navigation }) => ({
          title: "Provider Details",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Provider Details"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="EquipmentRequest"
        component={EquipmentRequest}
        options={({ navigation }) => ({
          title: "Equipment Request",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Equipment Request"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="BloodRequest"
        component={BloodRequest}
        options={({ navigation }) => ({
          title: "Blood Request",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Blood Request" />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="AmbulanceList"
        component={AmbulanceList}
        options={({ navigation }) => ({
          title: "Ambulance Services",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Ambulance Services"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="EquipmentRequestList"
        component={EquipmentRequestList}
        options={({ navigation }) => ({
          title: "Equipment Requests",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Equipment Requests"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={({ navigation }) => ({
          title: "Notifications",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Notifications" />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={({ navigation }) => ({
          title: "Complete Payment",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Complete Payment"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={({ navigation }) => ({
          title: "Payment Successful",
          headerShown: true,
          header: () => (
            <BackButtonHeader
              navigation={navigation}
              title="Payment Successful"
            />
          ),
        })}
      />
      <BottomTabStack.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={({ navigation }) => ({
          title: "Payment History",
          headerShown: true,
          header: () => (
            <BackButtonHeader navigation={navigation} title="Payment History" />
          ),
        })}
      />
    </BottomTabStack.Navigator>
  );
}

// Top Tab Navigator
const TopTab = createMaterialTopTabNavigator();

function TopTabNavigatorContent() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarIndicatorStyle: {
          backgroundColor: "#007AFF",
        },
        tabBarStyle: {
          backgroundColor: "#fff",
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          textTransform: "none",
        },
      }}
    >
      <TopTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
        }}
      />
      <TopTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
      <TopTab.Screen
        name="Settings"
        component={CardScreen}
        options={{
          title: "Settings",
        }}
      />
      <TopTab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Notifications",
        }}
      />
    </TopTab.Navigator>
  );
}

// Wrap Top Tab Navigator in Stack for header
const TopTabStack = createNativeStackNavigator();

function TopTabNavigator({
  currentLanguage,
  onLanguageChange,
}: {
  currentLanguage: AppLanguage;
  onLanguageChange: (l: AppLanguage) => void;
}) {
  return (
    <TopTabStack.Navigator
      screenOptions={{
        header: () => (
          <TopNavBar
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        ),
      }}
    >
      <TopTabStack.Screen
        name="Main"
        component={TopTabNavigatorContent}
        options={{ title: "Top Tabs" }}
      />
    </TopTabStack.Navigator>
  );
}

// Main App Navigator - Configurable
export default function AppNavigator() {
  const resolveInitialLanguage = (): AppLanguage => {
    if (i18n.language?.startsWith("ar")) {
      return "ar";
    }
    if (i18n.language?.startsWith("ur")) {
      return "ur";
    }
    if (i18n.language?.startsWith("tel")) {
      return "tel";
    }
    return "en";
  };

  const [language, setLanguage] = useState<AppLanguage>(
    resolveInitialLanguage(),
  );

  const handleLanguageChange = (lang: AppLanguage) => {
    syncLanguageWithStore(lang);
    setLanguage(lang);
  };

  const renderNavigator = () => {
    switch (NAVIGATION_CONFIG.type) {
      case "stack":
        return (
          <StackNavigator
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        );
      case "bottom-tabs":
        return (
          <BottomTabNavigator
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        );
      case "top-tabs":
        return (
          <TopTabNavigator
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        );
      case "drawer":
        return <DrawerNavigatorComponent />;
      default:
        return (
          <StackNavigator
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
          />
        );
    }
  };

  return renderNavigator();
}

// Export navigation config for easy modification
export { NAVIGATION_CONFIG };

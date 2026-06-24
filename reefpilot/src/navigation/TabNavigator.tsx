import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import type { TabParamList } from './types';
import { TankListScreen } from '@/screens/TankListScreen';
import { LogRedirectScreen } from '@/screens/LogRedirectScreen';
import { TrendsScreen } from '@/screens/TrendsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Tanks: 'fish-outline',
  LogTab: 'add-circle',
  Trends: 'analytics-outline',
  Settings: 'settings-outline',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={route.name === 'LogTab' ? size + 10 : size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Tanks" component={TankListScreen} options={{ title: 'Tanks' }} />
      <Tab.Screen name="LogTab" component={LogRedirectScreen} options={{ title: 'Log' }} />
      <Tab.Screen name="Trends" component={TrendsScreen} options={{ title: 'Trends' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

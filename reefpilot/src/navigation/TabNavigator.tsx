import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import type { RootStackParamList, TabParamList } from './types';
import { TankListScreen } from '@/screens/TankListScreen';
import { TrendsScreen } from '@/screens/TrendsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabParamList>();

const ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
  Tanks: 'fish-outline',
  LogTab: 'add-circle',
  Trends: 'analytics-outline',
  Settings: 'settings-outline',
};

/**
 * Placeholder for the center "Log" tab. It is never actually displayed — the
 * tab's `tabPress` listener intercepts the press, opens the add-reading modal,
 * and prevents the tab from gaining focus. (A focusable redirect screen would
 * re-open the modal every time you closed it.)
 */
function LogPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
}

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
      <Tab.Screen
        name="LogTab"
        component={LogPlaceholder}
        options={{ title: 'Log' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Don't switch to the (empty) Log tab — open the modal instead.
            e.preventDefault();
            const parent = navigation.getParent() as
              | NativeStackNavigationProp<RootStackParamList>
              | undefined;
            const { selectedTankId, tanks } = useTankStore.getState();
            const tankId = selectedTankId ?? tanks[0]?.id;
            if (tankId) parent?.navigate('AddReading', { tankId });
            else parent?.navigate('AddTank');
          },
        })}
      />
      <Tab.Screen name="Trends" component={TrendsScreen} options={{ title: 'Trends' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

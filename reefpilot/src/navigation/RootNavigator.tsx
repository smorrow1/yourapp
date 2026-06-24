import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { AddTankScreen } from '@/screens/AddTankScreen';
import { TankDetailScreen } from '@/screens/TankDetailScreen';
import { AddReadingScreen } from '@/screens/AddReadingScreen';
import { LogEventScreen } from '@/screens/LogEventScreen';
import { DosingCalculatorScreen } from '@/screens/DosingCalculatorScreen';
import { PaywallScreen } from '@/screens/PaywallScreen';
import { FeedbackScreen } from '@/screens/FeedbackScreen';
import { PrivacyScreen } from '@/screens/PrivacyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export function RootNavigator() {
  const onboarded = useSettingsStore((s) => s.onboarded);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {!onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        )}
        <Stack.Screen name="AddTank" component={AddTankScreen} options={{ title: 'New Tank', presentation: 'modal' }} />
        <Stack.Screen name="TankDetail" component={TankDetailScreen} options={{ title: '' }} />
        <Stack.Screen name="AddReading" component={AddReadingScreen} options={{ title: 'Log Test', presentation: 'modal' }} />
        <Stack.Screen name="LogEvent" component={LogEventScreen} options={{ title: 'Log Dose / Water Change', presentation: 'modal' }} />
        <Stack.Screen name="DosingCalculator" component={DosingCalculatorScreen} options={{ title: 'Dosing Calculator' }} />
        <Stack.Screen name="Paywall" component={PaywallScreen} options={{ title: 'ReefPilot Pro', presentation: 'modal' }} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Send Feedback' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

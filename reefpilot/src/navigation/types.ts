import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ParameterKey } from '@/types';
import type { PremiumFeature } from '@/lib/gating';

export type TabParamList = {
  Tanks: undefined;
  LogTab: undefined;
  Trends: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  AddTank: undefined;
  TankDetail: { tankId: string };
  AddReading: { tankId: string };
  LogEvent: { tankId: string; presetProductId?: string; presetAmountMl?: number };
  DosingCalculator: { tankId: string; paramKey?: ParameterKey };
  Paywall: { feature?: PremiumFeature } | undefined;
  Feedback: undefined;
  Privacy: undefined;
};

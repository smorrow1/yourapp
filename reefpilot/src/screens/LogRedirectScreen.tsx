import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * The center "Log" tab isn't a real screen — tapping it jumps straight into the
 * add-reading flow for the currently selected tank. Fewer taps = more logs.
 */
export function LogRedirectScreen() {
  const navigation = useNavigation<Nav>();

  useFocusEffect(
    useCallback(() => {
      const { selectedTankId, tanks } = useTankStore.getState();
      const tankId = selectedTankId ?? tanks[0]?.id;
      if (tankId) {
        navigation.navigate('AddReading', { tankId });
      } else {
        navigation.navigate('AddTank');
      }
    }, [navigation]),
  );

  return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
}

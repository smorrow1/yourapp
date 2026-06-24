import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { NumberField } from '@/components/NumberField';
import { colors, radius, spacing, typography } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import type { RootStackParamList } from '@/navigation/types';
import type { TankType } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TYPES: { key: TankType; label: string }[] = [
  { key: 'reef', label: 'Mixed Reef' },
  { key: 'nano', label: 'Nano' },
  { key: 'frag', label: 'Frag Tank' },
  { key: 'fowlr', label: 'FOWLR' },
];

export function AddTankScreen() {
  const navigation = useNavigation<Nav>();
  const addTank = useTankStore((s) => s.addTank);
  const [name, setName] = useState('');
  const [volume, setVolume] = useState('40');
  const [type, setType] = useState<TankType>('reef');

  const save = () => {
    addTank({ name: name.trim() || 'New Tank', volumeGallons: parseFloat(volume) || 0, type });
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.field}>
        <Text style={typography.label}>Tank name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Frag Tank 20g"
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primary}
          autoFocus
        />
      </View>

      <NumberField label="Volume" unit="US gallons" value={volume} onChangeText={setVolume} step={5} />

      <View style={styles.field}>
        <Text style={typography.label}>Type</Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => (
            <Text
              key={t.key}
              onPress={() => setType(t.key)}
              style={[styles.typeChip, type === t.key && styles.typeChipActive]}
            >
              {t.label}
            </Text>
          ))}
        </View>
      </View>

      <Button label="Save tank" onPress={save} style={styles.cta} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    height: 52,
    color: colors.text,
    fontSize: 16,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  typeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textMuted,
    overflow: 'hidden',
  },
  typeChipActive: {
    backgroundColor: `${colors.primary}22`,
    borderColor: colors.primary,
    color: colors.primary,
  },
  cta: { marginTop: spacing.md },
});

import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { NumberField } from '@/components/NumberField';
import { colors, radius, spacing, typography } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import { useReadingStore } from '@/store/useReadingStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { SAMPLE_TANK } from '@/domain/sampleData';
import type { TankType } from '@/types';

const TYPES: { key: TankType; label: string }[] = [
  { key: 'reef', label: 'Mixed Reef' },
  { key: 'nano', label: 'Nano' },
  { key: 'frag', label: 'Frag Tank' },
  { key: 'fowlr', label: 'FOWLR' },
];

export function OnboardingScreen() {
  const [name, setName] = useState('');
  const [volume, setVolume] = useState('40');
  const [type, setType] = useState<TankType>('reef');

  const addTank = useTankStore((s) => s.addTank);
  const setOnboarded = useSettingsStore((s) => s.setOnboarded);

  const createMyTank = () => {
    addTank({ name: name.trim() || 'My Reef', volumeGallons: parseFloat(volume) || 0, type });
    // Replace the bundled demo data with the user's real first tank.
    useTankStore.getState().removeTank(SAMPLE_TANK.id);
    useReadingStore.setState((s) => ({
      readings: s.readings.filter((r) => r.tankId !== SAMPLE_TANK.id),
    }));
    setOnboarded(true);
  };

  const exploreDemo = () => setOnboarded(true);

  return (
    <ScreenContainer scroll>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="water" size={34} color={colors.bg} />
        </View>
        <Text style={typography.display}>ReefPilot</Text>
        <Text style={styles.tagline}>
          Log your water, catch swings early, dose with confidence.
        </Text>
      </View>

      <Card>
        <Text style={typography.heading}>Set up your tank</Text>
        <Text style={styles.help}>Takes about 30 seconds. No account needed.</Text>

        <View style={styles.field}>
          <Text style={typography.label}>Tank name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Living Room 75g"
            placeholderTextColor={colors.textFaint}
            selectionColor={colors.primary}
          />
        </View>

        <View style={styles.field}>
          <NumberField label="Volume" unit="US gallons" value={volume} onChangeText={setVolume} step={5} />
        </View>

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

        <Button label="Create my tank" onPress={createMyTank} style={styles.cta} />
      </Card>

      <Button label="Explore with demo data" variant="ghost" onPress={exploreDemo} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tagline: { ...typography.body, color: colors.textMuted, textAlign: 'center', maxWidth: 300 },
  help: { ...typography.caption, marginTop: 4, marginBottom: spacing.md },
  field: { gap: spacing.sm, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surfaceAlt,
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
  cta: { marginTop: spacing.xl },
});

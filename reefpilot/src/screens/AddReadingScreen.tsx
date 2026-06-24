import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { NumberField } from '@/components/NumberField';
import { colors, radius, spacing, typography } from '@/theme';
import { useReadingStore } from '@/store/useReadingStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { CORE_PARAMETER_KEYS, PARAMETERS_BY_KEY } from '@/domain/parameters';
import { UPSELL_AFTER_READINGS } from '@/lib/gating';
import type { ParameterKey } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'AddReading'>;

export function AddReadingScreen() {
  const navigation = useNavigation<Nav>();
  const { tankId } = useRoute<Rt>().params;

  const addReading = useReadingStore((s) => s.addReading);
  const latest = useReadingStore((s) => s.latestForTank(tankId));
  const { isPro, upsellNudgeShown, markNudgeShown } = usePremiumStore();

  // Pre-fill from the last reading so a "nothing changed" log is one tap.
  const initial = useMemo(() => {
    const out: Record<string, string> = {};
    for (const key of CORE_PARAMETER_KEYS) {
      const v = latest?.values[key];
      out[key] = v !== undefined ? String(v) : '';
    }
    return out;
  }, [latest]);

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [note, setNote] = useState('');

  const setVal = (key: ParameterKey, v: string) => setValues((s) => ({ ...s, [key]: v }));

  const save = () => {
    const parsed: Partial<Record<ParameterKey, number>> = {};
    for (const key of CORE_PARAMETER_KEYS) {
      const raw = values[key];
      if (raw !== undefined && raw !== '') {
        const n = parseFloat(raw);
        if (!Number.isNaN(n)) parsed[key] = n;
      }
    }
    addReading({ tankId, takenAt: new Date().toISOString(), values: parsed, note: note.trim() || undefined });

    const count = useReadingStore.getState().readingsForTank(tankId).length;
    navigation.goBack();

    // Soft, one-time upsell after the user has felt the core value.
    if (!isPro && !upsellNudgeShown && count >= UPSELL_AFTER_READINGS) {
      markNudgeShown();
      setTimeout(() => navigation.navigate('Paywall', { feature: 'dosing' }), 350);
    }
  };

  return (
    <ScreenContainer scroll>
      <Text style={typography.caption}>
        Enter what you measured. Leave blank to skip a parameter — values prefill from your last test.
      </Text>

      {CORE_PARAMETER_KEYS.map((key) => {
        const def = PARAMETERS_BY_KEY[key];
        return (
          <NumberField
            key={key}
            label={`${def.label}`}
            unit={def.unit || undefined}
            value={values[key]}
            onChangeText={(v) => setVal(key, v)}
            step={def.step}
          />
        );
      })}

      <View style={styles.field}>
        <Text style={typography.label}>Note (optional)</Text>
        <TextInput
          style={styles.note}
          value={note}
          onChangeText={setNote}
          placeholder="Water change, new dosing, observations…"
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primary}
          multiline
        />
      </View>

      <Button label="Save reading" onPress={save} style={styles.cta} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.sm },
  note: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 80,
    color: colors.text,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  cta: { marginTop: spacing.sm },
});

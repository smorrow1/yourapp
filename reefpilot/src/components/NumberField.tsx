import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme';

interface Props {
  label: string;
  unit?: string;
  value: string;
  onChangeText: (v: string) => void;
  step?: number;
  placeholder?: string;
}

/** Numeric input with +/- steppers — thumb-friendly for quick test logging. */
export function NumberField({ label, unit, value, onChangeText, step = 1, placeholder }: Props) {
  const adjust = (dir: 1 | -1) => {
    const current = parseFloat(value || '0') || 0;
    const next = Math.max(0, current + dir * step);
    const decimals = step < 1 ? 2 : 0;
    onChangeText(next.toFixed(decimals));
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={typography.label}>{label}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <View style={styles.inputRow}>
        <Pressable style={styles.stepper} onPress={() => adjust(-1)} hitSlop={8}>
          <Ionicons name="remove" size={20} color={colors.text} />
        </Pressable>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder={placeholder ?? '—'}
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.primary}
        />
        <Pressable style={styles.stepper} onPress={() => adjust(1)} hitSlop={8}>
          <Ionicons name="add" size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  unit: { ...typography.caption, color: colors.textFaint },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepper: {
    width: 48,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
});

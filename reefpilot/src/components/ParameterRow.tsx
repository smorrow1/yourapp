import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/theme';
import { formatValue, getStatus, PARAMETERS_BY_KEY } from '@/domain/parameters';
import { statusColor } from './StatusBadge';
import type { ParameterKey } from '@/types';

interface Props {
  paramKey: ParameterKey;
  value: number | undefined;
  onPress?: () => void;
}

export function ParameterRow({ paramKey, value, onPress }: Props) {
  const def = PARAMETERS_BY_KEY[paramKey];
  const status = getStatus(paramKey, value);
  const color = statusColor(status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.pressed]}
    >
      <View style={[styles.bar, { backgroundColor: color }]} />
      <View style={styles.flex}>
        <Text style={typography.body}>{def.label}</Text>
        <Text style={styles.range}>
          Target {def.min}–{def.max} {def.unit}
        </Text>
      </View>
      <View style={styles.valueWrap}>
        <Text style={[styles.value, { color }]}>{formatValue(paramKey, value)}</Text>
        <Text style={styles.unit}>{def.unit}</Text>
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: { opacity: 0.7 },
  bar: { width: 4, height: 36, borderRadius: radius.sm },
  flex: { flex: 1 },
  range: { ...typography.caption, marginTop: 2 },
  valueWrap: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  value: { fontSize: 20, fontWeight: '700' },
  unit: { ...typography.caption, color: colors.textFaint },
});

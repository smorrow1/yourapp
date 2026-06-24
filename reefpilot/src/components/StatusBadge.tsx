import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/theme';
import type { ParameterStatus } from '@/types';

const STATUS_META: Record<ParameterStatus, { color: string; label: string }> = {
  good: { color: colors.good, label: 'In range' },
  warn: { color: colors.warn, label: 'Watch' },
  danger: { color: colors.danger, label: 'Out of range' },
  empty: { color: colors.textFaint, label: 'No data' },
};

export function statusColor(status: ParameterStatus): string {
  return STATUS_META[status].color;
}

export function StatusBadge({ status }: { status: ParameterStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.badge, { backgroundColor: `${meta.color}22`, borderColor: meta.color }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  label: { fontSize: 12, fontWeight: '600' },
});

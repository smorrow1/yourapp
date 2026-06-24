import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { TrendChart } from '@/components/TrendChart';
import { colors, radius, spacing, typography } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import { useReadingStore } from '@/store/useReadingStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { CORE_PARAMETER_KEYS, formatValue, getStatus, PARAMETERS_BY_KEY } from '@/domain/parameters';
import { statusColor } from '@/components/StatusBadge';
import { FREE_TREND_DAYS } from '@/lib/gating';
import { shortDate } from '@/lib/format';
import type { ParameterKey } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function TrendsScreen() {
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const selectedTankId = useTankStore((s) => s.selectedTankId);
  const tank = useTankStore((s) => s.tanks.find((t) => t.id === s.selectedTankId));
  // subscribe so the chart updates when readings change
  useReadingStore((s) => s.readings);
  const isPro = usePremiumStore((s) => s.isPro);

  const [param, setParam] = useState<ParameterKey>('alkalinity');

  if (!tank || !selectedTankId) {
    return (
      <ScreenContainer>
        <EmptyState icon="analytics-outline" title="No tank selected" message="Add a tank and log a few tests to see trends." />
      </ScreenContainer>
    );
  }

  let series = useReadingStore.getState().seriesForParam(selectedTankId, param);
  if (!isPro) {
    const cutoff = Date.now() - FREE_TREND_DAYS * 24 * 60 * 60 * 1000;
    series = series.filter((p) => +new Date(p.takenAt) >= cutoff);
  }

  const def = PARAMETERS_BY_KEY[param];
  const last = series[series.length - 1];
  const chartWidth = width - spacing.lg * 2 - spacing.lg * 2;

  return (
    <ScreenContainer scroll>
      <Text style={typography.display}>Trends</Text>
      <Text style={typography.caption}>{tank.name}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {CORE_PARAMETER_KEYS.map((key) => (
          <Text
            key={key}
            onPress={() => setParam(key)}
            style={[styles.chip, param === key && styles.chipActive]}
          >
            {PARAMETERS_BY_KEY[key].short}
          </Text>
        ))}
      </ScrollView>

      <Card>
        <View style={styles.cardHead}>
          <View>
            <Text style={typography.heading}>{def.label}</Text>
            <Text style={typography.caption}>
              Target {def.min}–{def.max} {def.unit}
            </Text>
          </View>
          {last ? (
            <View style={styles.lastWrap}>
              <Text style={[styles.lastValue, { color: statusColor(getStatus(param, last.value)) }]}>
                {formatValue(param, last.value)}
              </Text>
              <Text style={typography.caption}>{shortDate(last.takenAt)}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.chartWrap}>
          <TrendChart paramKey={param} data={series} width={chartWidth} />
        </View>
      </Card>

      {!isPro ? (
        <Card onPress={() => navigation.navigate('Paywall', { feature: 'full-history' })} style={styles.upsell}>
          <Text style={typography.heading}>See your full history</Text>
          <Text style={[typography.caption, { marginTop: 4 }]}>
            Free shows the last {FREE_TREND_DAYS} days. Unlock ReefPilot Pro for unlimited trend history and overlays.
          </Text>
        </Card>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chips: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textMuted,
    overflow: 'hidden',
  },
  chipActive: { backgroundColor: `${colors.primary}22`, borderColor: colors.primary, color: colors.primary },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  lastWrap: { alignItems: 'flex-end' },
  lastValue: { fontSize: 26, fontWeight: '700' },
  chartWrap: { marginTop: spacing.lg },
  upsell: { borderColor: colors.primary, borderStyle: 'dashed' },
});

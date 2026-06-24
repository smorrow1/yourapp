import React, { useLayoutEffect, useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ParameterRow } from '@/components/ParameterRow';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, typography } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import { useReadingStore } from '@/store/useReadingStore';
import { useEventStore } from '@/store/useEventStore';
import { CORE_PARAMETER_KEYS, PARAMETERS_BY_KEY } from '@/domain/parameters';
import { timeAgo } from '@/lib/format';
import type { RootStackParamList } from '@/navigation/types';
import type { TankEvent } from '@/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Rt = RouteProp<RootStackParamList, 'TankDetail'>;

export function TankDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { tankId } = useRoute<Rt>().params;

  const tank = useTankStore((s) => s.tanks.find((t) => t.id === tankId));
  const removeTank = useTankStore((s) => s.removeTank);
  const selectTank = useTankStore((s) => s.selectTank);
  // Subscribe to the stable array reference, then derive the filtered/sorted
  // list with useMemo. Returning `.filter(...)` directly from the selector would
  // produce a new array every render and loop under zustand v5 / useSyncExternalStore.
  const allReadings = useReadingStore((s) => s.readings);
  const readings = useMemo(
    () =>
      allReadings
        .filter((r) => r.tankId === tankId)
        .sort((a, b) => +new Date(b.takenAt) - +new Date(a.takenAt)),
    [allReadings, tankId],
  );

  const latest = readings[0];

  const allEvents = useEventStore((s) => s.events);
  const events = useMemo(
    () => allEvents.filter((e) => e.tankId === tankId).sort((a, b) => +new Date(b.at) - +new Date(a.at)),
    [allEvents, tankId],
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: tank?.name ?? 'Tank' });
    if (tank) selectTank(tank.id);
  }, [navigation, tank, selectTank]);

  if (!tank) {
    return (
      <ScreenContainer>
        <EmptyState title="Tank not found" message="It may have been deleted." />
      </ScreenContainer>
    );
  }

  const confirmDelete = () => {
    Alert.alert('Delete tank?', `This removes ${tank.name}, its readings, and its activity.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          useReadingStore.setState((s) => ({ readings: s.readings.filter((r) => r.tankId !== tankId) }));
          useEventStore.getState().removeEventsForTank(tankId);
          removeTank(tankId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScreenContainer scroll>
      <Button
        label="Log a test"
        onPress={() => navigation.navigate('AddReading', { tankId })}
        icon={<Ionicons name="add-circle-outline" size={20} color={colors.bg} />}
      />
      <Button
        label="Log dose / water change"
        variant="secondary"
        onPress={() => navigation.navigate('LogEvent', { tankId })}
        icon={<Ionicons name="eyedrop-outline" size={18} color={colors.text} />}
      />

      {!latest ? (
        <EmptyState
          icon="flask-outline"
          title="No readings yet"
          message="Run your test kit and log the values to see what's in and out of range."
          actionLabel="Log your first test"
          onAction={() => navigation.navigate('AddReading', { tankId })}
        />
      ) : (
        <>
          <SectionHeader
            title="Latest reading"
            subtitle={`Tested ${timeAgo(latest.takenAt)}`}
            right={
              <Button
                label="Dose"
                variant="secondary"
                onPress={() => navigation.navigate('DosingCalculator', { tankId })}
                style={styles.doseBtn}
              />
            }
          />
          <Card style={styles.params}>
            {CORE_PARAMETER_KEYS.map((key, i) => (
              <View key={key}>
                <ParameterRow
                  paramKey={key}
                  value={latest.values[key]}
                  onPress={() => navigation.navigate('DosingCalculator', { tankId, paramKey: key })}
                />
                {i < CORE_PARAMETER_KEYS.length - 1 ? <View style={styles.divider} /> : null}
              </View>
            ))}
          </Card>
          {latest.note ? (
            <Card>
              <Text style={typography.label}>Note</Text>
              <Text style={[typography.body, { marginTop: 4 }]}>{latest.note}</Text>
            </Card>
          ) : null}

          <SectionHeader title="History" subtitle={`${readings.length} readings`} />
          {readings.map((r) => (
            <Card key={r.id}>
              <View style={styles.histRow}>
                <Text style={typography.body}>{new Date(r.takenAt).toLocaleDateString()}</Text>
                <Text style={typography.caption}>{timeAgo(r.takenAt)}</Text>
              </View>
            </Card>
          ))}
        </>
      )}

      {events.length > 0 ? (
        <>
          <SectionHeader title="Activity" subtitle={`${events.length} logged`} />
          {events.map((ev) => (
            <Card key={ev.id}>
              <View style={styles.histRow}>
                <View style={styles.activityLeft}>
                  <Ionicons
                    name={ev.type === 'dose' ? 'eyedrop-outline' : 'water-outline'}
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={typography.body}>{describeEvent(ev)}</Text>
                </View>
                <Text style={typography.caption}>{timeAgo(ev.at)}</Text>
              </View>
            </Card>
          ))}
        </>
      ) : null}

      <Button label="Delete tank" variant="danger" onPress={confirmDelete} style={styles.delete} />
    </ScreenContainer>
  );
}

function describeEvent(ev: TankEvent): string {
  if (ev.type === 'waterChange') return `${ev.percent ?? 0}% water change`;
  const label = ev.paramKey ? PARAMETERS_BY_KEY[ev.paramKey].label : 'Dose';
  return `Dosed ${ev.amountMl ?? 0} mL · ${label}`;
}

const styles = StyleSheet.create({
  doseBtn: { minHeight: 40, paddingHorizontal: spacing.lg },
  params: { paddingVertical: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 2 },
  histRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  delete: { marginTop: spacing.xl },
});

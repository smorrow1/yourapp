import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { colors, spacing, typography } from '@/theme';
import { useTankStore } from '@/store/useTankStore';
import { useReadingStore } from '@/store/useReadingStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { getStatus, PARAMETERS_BY_KEY } from '@/domain/parameters';
import { timeAgo } from '@/lib/format';
import { FREE_TANK_LIMIT } from '@/lib/gating';
import type { ParameterStatus, Tank } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function worstStatus(tank: Tank): ParameterStatus {
  const latest = useReadingStore.getState().latestForTank(tank.id);
  if (!latest) return 'empty';
  const order: ParameterStatus[] = ['danger', 'warn', 'good', 'empty'];
  let worst: ParameterStatus = 'good';
  for (const key of Object.keys(latest.values) as (keyof typeof PARAMETERS_BY_KEY)[]) {
    const s = getStatus(key, latest.values[key]);
    if (order.indexOf(s) < order.indexOf(worst)) worst = s;
  }
  return worst;
}

export function TankListScreen() {
  const navigation = useNavigation<Nav>();
  const tanks = useTankStore((s) => s.tanks);
  const readings = useReadingStore((s) => s.readings);
  const isPro = usePremiumStore((s) => s.isPro);

  const atLimit = !isPro && tanks.length >= FREE_TANK_LIMIT;

  const onAddTank = () => {
    if (atLimit) {
      navigation.navigate('Paywall', { feature: 'unlimited-tanks' });
    } else {
      navigation.navigate('AddTank');
    }
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={typography.display}>Your Tanks</Text>
        <Button
          label="Add"
          variant="secondary"
          onPress={onAddTank}
          icon={<Ionicons name="add" size={18} color={colors.text} />}
          style={styles.addBtn}
        />
      </View>

      {tanks.length === 0 ? (
        <EmptyState
          icon="fish-outline"
          title="No tanks yet"
          message="Add your first tank to start logging water tests."
          actionLabel="Add a tank"
          onAction={onAddTank}
        />
      ) : (
        tanks.map((tank) => {
          const latest = readings
            .filter((r) => r.tankId === tank.id)
            .sort((a, b) => +new Date(b.takenAt) - +new Date(a.takenAt))[0];
          return (
            <Card key={tank.id} onPress={() => navigation.navigate('TankDetail', { tankId: tank.id })}>
              <View style={styles.cardTop}>
                <View style={styles.flex}>
                  <Text style={typography.heading}>{tank.name}</Text>
                  <Text style={typography.caption}>
                    {tank.volumeGallons} gal · {tank.type.toUpperCase()}
                  </Text>
                </View>
                <StatusBadge status={worstStatus(tank)} />
              </View>
              <View style={styles.cardBottom}>
                <Ionicons name="time-outline" size={14} color={colors.textFaint} />
                <Text style={typography.caption}>
                  {latest ? `Last tested ${timeAgo(latest.takenAt)}` : 'No tests logged yet'}
                </Text>
              </View>
            </Card>
          );
        })
      )}

      {atLimit ? (
        <Text style={styles.limitNote}>
          Free plan includes 1 tank. Upgrade to ReefPilot Pro for unlimited tanks.
        </Text>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addBtn: { minHeight: 40, paddingHorizontal: spacing.md },
  flex: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.md },
  limitNote: { ...typography.caption, textAlign: 'center', color: colors.textFaint },
});

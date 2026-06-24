import React from 'react';
import { Alert, Linking, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { colors, radius, spacing, typography } from '@/theme';
import { useSettingsStore } from '@/store/useSettingsStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { scheduleTestReminder } from '@/lib/notifications';
import { useTankStore } from '@/store/useTankStore';
import type { RootStackParamList } from '@/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { units, setUnits, remindersEnabled, setRemindersEnabled, reminderEveryDays } = useSettingsStore();
  const { isPro, plan } = usePremiumStore();

  const toggleReminders = async (next: boolean) => {
    setRemindersEnabled(next);
    if (next) {
      const tank = useTankStore.getState().tanks[0];
      const id = await scheduleTestReminder(tank?.name ?? 'your reef', reminderEveryDays);
      if (!id) {
        setRemindersEnabled(false);
        Alert.alert('Notifications off', 'Enable notifications for ReefPilot in system settings to get test reminders.');
      }
    }
  };

  return (
    <ScreenContainer scroll>
      <Text style={typography.display}>Settings</Text>

      {!isPro ? (
        <Card onPress={() => navigation.navigate('Paywall')} style={styles.proCard}>
          <View style={styles.proRow}>
            <Ionicons name="sparkles" size={22} color={colors.bg} />
            <View style={styles.flex}>
              <Text style={[typography.heading, { color: colors.bg }]}>Upgrade to ReefPilot Pro</Text>
              <Text style={[typography.caption, { color: colors.bg }]}>Dosing, unlimited tanks & export</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.bg} />
          </View>
        </Card>
      ) : (
        <Card>
          <View style={styles.row}>
            <Ionicons name="checkmark-circle" size={22} color={colors.good} />
            <Text style={typography.body}>ReefPilot Pro active ({plan})</Text>
          </View>
        </Card>
      )}

      <Card>
        <Text style={typography.label}>Units</Text>
        <View style={styles.segment}>
          {(['imperial', 'metric'] as const).map((u) => (
            <Text
              key={u}
              onPress={() => setUnits(u)}
              style={[styles.segmentItem, units === u && styles.segmentActive]}
            >
              {u === 'imperial' ? '°F / gal' : '°C / L'}
            </Text>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.flex}>
            <Text style={typography.body}>Test reminders</Text>
            <Text style={typography.caption}>Every {reminderEveryDays} days</Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={toggleReminders}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>
      </Card>

      <Card>
        <SettingLink icon="chatbubble-ellipses-outline" label="Send feedback" onPress={() => navigation.navigate('Feedback')} />
        <View style={styles.divider} />
        <SettingLink icon="shield-checkmark-outline" label="Privacy" onPress={() => navigation.navigate('Privacy')} />
        <View style={styles.divider} />
        <SettingLink
          icon="star-outline"
          label="Rate ReefPilot"
          onPress={() => Linking.openURL('https://apps.apple.com/app/idTODO')}
        />
      </Card>

      <Text style={styles.version}>ReefPilot v0.1.0 · Made for reefers</Text>
    </ScreenContainer>
  );
}

function SettingLink({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.settingRow} onTouchEnd={onPress}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <Text style={[typography.body, styles.flex]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
    </View>
  );
}

const styles = StyleSheet.create({
  proCard: { backgroundColor: colors.primary, borderColor: colors.primary },
  proRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: 4,
    marginTop: spacing.sm,
  },
  segmentItem: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    color: colors.textMuted,
    overflow: 'hidden',
  },
  segmentActive: { backgroundColor: colors.primary, color: colors.bg, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs },
  version: { ...typography.caption, textAlign: 'center', color: colors.textFaint },
});

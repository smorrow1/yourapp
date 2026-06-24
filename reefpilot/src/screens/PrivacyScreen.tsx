import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors, spacing, typography } from '@/theme';

/**
 * Placeholder privacy copy. The MVP stores everything on-device with no account
 * and no analytics by default.
 * TODO: replace with a reviewed privacy policy and host it at a public URL before
 * store submission. Add analytics/crash disclosure here if/when you add a SDK.
 */
export function PrivacyScreen() {
  return (
    <ScreenContainer scroll>
      <Text style={typography.heading}>Your data stays on your device</Text>

      <Text style={styles.p}>
        ReefPilot is offline-first. Your tanks and readings are stored locally on your phone. We do
        not require an account and we do not upload your data to any server.
      </Text>

      <Text style={styles.h}>What we collect</Text>
      <Text style={styles.p}>
        Nothing is sent off your device in this version. Purchases are processed by the App Store /
        Google Play; we never see your payment details.
      </Text>

      <Text style={styles.h}>Notifications</Text>
      <Text style={styles.p}>
        If you enable test reminders, they are scheduled locally on your device. No data leaves the app.
      </Text>

      <Text style={styles.h}>Deleting your data</Text>
      <Text style={styles.p}>
        Deleting a tank removes its readings. Uninstalling the app removes everything.
      </Text>

      <Text style={styles.todo}>
        TODO: Replace this placeholder with your reviewed legal policy before submitting to the stores.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  h: { ...typography.heading, marginTop: spacing.lg },
  p: { ...typography.body, color: colors.textMuted, lineHeight: 22 },
  todo: { ...typography.caption, color: colors.textFaint, marginTop: spacing.xl },
});

import React from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors, spacing, typography } from '@/theme';

// TODO: point these at your hosted docs/PRIVACY.md and docs/TERMS.md before release.
const PRIVACY_URL = 'https://TODO.example.com/privacy';
const TERMS_URL = 'https://TODO.example.com/terms';

export function PrivacyScreen() {
  return (
    <ScreenContainer scroll>
      <Text style={typography.heading}>Your data stays on your device</Text>

      <Text style={styles.p}>
        ReefPilot is offline-first. Your tanks, readings, and dose logs are stored locally on your
        phone. We do not require an account and we do not upload your aquarium data to any server.
      </Text>

      <Text style={styles.h}>Purchases</Text>
      <Text style={styles.p}>
        ReefPilot Pro is sold through the App Store / Google Play. Payment is handled by the store —
        we never see your payment details. We use RevenueCat to validate receipts using an anonymous
        app user ID; no personal or aquarium data is shared.
      </Text>

      <Text style={styles.h}>Export & notifications</Text>
      <Text style={styles.p}>
        Exporting CSV hands a file to your device’s share sheet — where it goes next is your choice.
        Test reminders are scheduled locally; no data leaves the app.
      </Text>

      <Text style={styles.h}>Deleting your data</Text>
      <Text style={styles.p}>
        Deleting a tank removes its readings and activity. Uninstalling the app removes everything.
      </Text>

      <Pressable onPress={() => Linking.openURL(PRIVACY_URL)}>
        <Text style={styles.link}>Full Privacy Policy ↗</Text>
      </Pressable>
      <Pressable onPress={() => Linking.openURL(TERMS_URL)}>
        <Text style={styles.link}>Terms of Use ↗</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  h: { ...typography.heading, marginTop: spacing.lg },
  p: { ...typography.body, color: colors.textMuted, lineHeight: 22 },
  link: { ...typography.body, color: colors.primary, marginTop: spacing.md, fontWeight: '600' },
});

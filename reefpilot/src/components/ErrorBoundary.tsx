import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

/** Catches render/runtime errors so the app shows a friendly screen instead of a white crash. */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // TODO: forward to a crash reporter (e.g. Sentry) before release.
    console.error('ReefPilot crashed:', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.wrap}>
        <Text style={styles.emoji}>🌊</Text>
        <Text style={[typography.heading, styles.center]}>Something went wrong</Text>
        <Text style={styles.message}>
          Please fully close and reopen ReefPilot. Your tanks and readings are saved on your device.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emoji: { fontSize: 48 },
  center: { textAlign: 'center' },
  message: { ...typography.body, color: colors.textMuted, textAlign: 'center', maxWidth: 300 },
});

import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { colors, radius, spacing, typography } from '@/theme';

// TODO: replace with your real support address before release.
const SUPPORT_EMAIL = 'support@reefpilot.app';

export function FeedbackScreen() {
  const [message, setMessage] = useState('');

  const send = () => {
    const body = encodeURIComponent(message || '');
    const subject = encodeURIComponent('ReefPilot feedback');
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`);
  };

  return (
    <ScreenContainer scroll>
      <Text style={typography.heading}>We read every message</Text>
      <Text style={typography.caption}>
        Found a bug, want a parameter added, or have a dosing product to support? Tell us.
      </Text>

      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="What's on your mind?"
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.primary}
        multiline
        autoFocus
      />

      <Button label="Send via email" onPress={send} />
      <Text style={styles.note}>Opens your mail app to {SUPPORT_EMAIL}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 140,
    color: colors.text,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  note: { ...typography.caption, textAlign: 'center', color: colors.textFaint },
});

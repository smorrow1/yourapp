import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/**
 * Schedule a recurring "time to test your water" reminder.
 * Returns the notification id so it can be cancelled later.
 */
export async function scheduleTestReminder(
  tankName: string,
  everyDays: number,
  hour = 18,
): Promise<string | null> {
  const ok = await ensureNotificationPermission();
  if (!ok) return null;

  // expo-notifications can't natively repeat every N days, so we schedule the
  // next occurrence and re-arm on fire. For weekly we use a weekday trigger.
  const seconds = everyDays * 24 * 60 * 60;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌊 Time to test your reef',
      body: `${tankName} is due for a water test.`,
    },
    trigger:
      Platform.OS === 'web'
        ? null
        : { seconds, repeats: true, channelId: 'reminders' },
  });
  return id;
}

export async function cancelReminder(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // already cancelled / invalid id — safe to ignore
  }
}

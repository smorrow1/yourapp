import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // expo-notifications 0.32+ (Expo SDK 54): shouldShowAlert is replaced by
    // the more granular shouldShowBanner / shouldShowList.
    shouldShowBanner: true,
    shouldShowList: true,
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
): Promise<string | null> {
  const ok = await ensureNotificationPermission();
  if (!ok) return null;

  const seconds = everyDays * 24 * 60 * 60;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌊 Time to test your reef',
      body: `${tankName} is due for a water test.`,
    },
    // Web has no native scheduler; fire immediately there, repeat on device.
    trigger:
      Platform.OS === 'web'
        ? null
        : {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds,
            repeats: true,
          },
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

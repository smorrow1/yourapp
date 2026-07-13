import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useTankStore } from '@/store/useTankStore';
import { useReadingStore } from '@/store/useReadingStore';
import { useEventStore } from '@/store/useEventStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { usePremiumStore } from '@/store/usePremiumStore';

// Keep the native splash up until persisted state has hydrated (below).
SplashScreen.preventAutoHideAsync().catch(() => {});

type Hydratable = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (cb: () => void) => () => void;
  };
};

const persistedStores: Hydratable[] = [
  useTankStore,
  useReadingStore,
  useEventStore,
  useSettingsStore,
  usePremiumStore,
];

function allHydrated(): boolean {
  return persistedStores.every((s) => s.persist.hasHydrated());
}

async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('reminders', {
    name: 'Test reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

/**
 * Gates the UI until every persisted store has loaded from disk, so we never
 * flash the onboarding or free-tier state before real data hydrates. Also does
 * one-time launch setup (notification channel, entitlement refresh) and hides
 * the native splash once ready.
 */
export function useAppReady(): boolean {
  const [ready, setReady] = useState<boolean>(() => allHydrated());

  useEffect(() => {
    if (ready) return;
    const check = () => {
      if (allHydrated()) setReady(true);
    };
    const unsubs = persistedStores.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubs.forEach((u) => u());
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      await setupNotificationChannel().catch(() => {});
      await SplashScreen.hideAsync().catch(() => {});
    })();
    // Refresh entitlements in the background — never block first paint on a network call.
    usePremiumStore.getState().refresh().catch(() => {});
  }, [ready]);

  return ready;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { UnitSystem } from '@/types';

interface SettingsState {
  onboarded: boolean;
  units: UnitSystem;
  remindersEnabled: boolean;
  reminderEveryDays: number;
  setOnboarded: (v: boolean) => void;
  setUnits: (u: UnitSystem) => void;
  setRemindersEnabled: (v: boolean) => void;
  setReminderEveryDays: (n: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      onboarded: false,
      units: 'imperial',
      remindersEnabled: false,
      reminderEveryDays: 7,
      setOnboarded: (v) => set({ onboarded: v }),
      setUnits: (u) => set({ units: u }),
      setRemindersEnabled: (v) => set({ remindersEnabled: v }),
      setReminderEveryDays: (n) => set({ reminderEveryDays: n }),
    }),
    { name: 'reefpilot.settings', storage: zustandStorage },
  ),
);

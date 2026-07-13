import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { initIap, isIapConfigured, purchasePlan, restorePurchases } from '@/lib/iap';
import type { PremiumPlan } from '@/types';

interface PremiumState {
  isPro: boolean;
  plan: PremiumPlan;
  /** Whether the one-time "you've logged 3 tests" nudge has been shown. */
  upsellNudgeShown: boolean;

  /** Sync entitlement state from the store on launch (no-op when IAP unconfigured). */
  refresh: () => Promise<void>;
  /** Buy a plan. Falls back to a local unlock when IAP isn't configured (dev). */
  purchase: (plan: Exclude<PremiumPlan, 'free'>) => Promise<'success' | 'cancelled' | 'error'>;
  restore: () => Promise<'restored' | 'none' | 'error'>;

  markNudgeShown: () => void;
  /** Dev-only: force Pro on/off to test paywalled features and gates. */
  devSetPro: (value: boolean) => void;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set, get) => ({
      isPro: false,
      plan: 'free',
      upsellNudgeShown: false,

      refresh: async () => {
        if (!isIapConfigured()) return; // dev / Expo Go: keep persisted state
        const pro = await initIap();
        if (pro !== null) set({ isPro: pro, plan: pro ? (get().plan === 'free' ? 'lifetime' : get().plan) : 'free' });
      },

      purchase: async (plan) => {
        // No RevenueCat key (dev / Expo Go): unlock locally so the flow is testable.
        if (!isIapConfigured()) {
          set({ isPro: true, plan });
          return 'success';
        }
        const result = await purchasePlan(plan);
        if (result === 'success') {
          set({ isPro: true, plan });
          return 'success';
        }
        if (result === 'cancelled') return 'cancelled';
        return 'error';
      },

      restore: async () => {
        if (!isIapConfigured()) return get().isPro ? 'restored' : 'none';
        const result = await restorePurchases();
        if (result === 'restored') {
          set({ isPro: true });
          return 'restored';
        }
        if (result === 'none') return 'none';
        return 'error';
      },

      markNudgeShown: () => set({ upsellNudgeShown: true }),
      devSetPro: (value) => set({ isPro: value, plan: value ? 'lifetime' : 'free' }),
    }),
    { name: 'reefpilot.premium', storage: zustandStorage },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { PremiumPlan } from '@/types';

interface PremiumState {
  isPro: boolean;
  plan: PremiumPlan;
  /** Whether the one-time "you've logged 3 tests" nudge has been shown. */
  upsellNudgeShown: boolean;

  /**
   * TODO: Replace these mock methods with RevenueCat:
   *   - purchasePackage() / restorePurchases()
   *   - listen to CustomerInfo.entitlements.active['pro']
   * Keep the same interface so screens don't change.
   */
  mockPurchase: (plan: Exclude<PremiumPlan, 'free'>) => void;
  mockRestore: () => void;
  markNudgeShown: () => void;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set) => ({
      isPro: false,
      plan: 'free',
      upsellNudgeShown: false,

      mockPurchase: (plan) => set({ isPro: true, plan }),
      mockRestore: () => {
        // TODO: call RevenueCat restorePurchases(); for now this is a no-op
        // unless a prior mock purchase persisted isPro.
      },
      markNudgeShown: () => set({ upsellNudgeShown: true }),
    }),
    { name: 'reefpilot.premium', storage: zustandStorage },
  ),
);

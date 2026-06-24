/**
 * Central place for all free-tier limits and premium feature flags.
 * Keeping these in one file makes it trivial to tune conversion without
 * hunting through screens.
 */
export const FREE_TANK_LIMIT = 1;
export const FREE_HISTORY_DAYS = 30;
export const FREE_TREND_DAYS = 14;
export const FREE_REMINDERS_PER_TANK = 1;

/** Number of saved readings after which we show the one-time upsell nudge. */
export const UPSELL_AFTER_READINGS = 3;

export type PremiumFeature =
  | 'dosing'
  | 'export'
  | 'unlimited-tanks'
  | 'full-history'
  | 'custom-parameters'
  | 'unlimited-reminders';

export const FEATURE_COPY: Record<PremiumFeature, { title: string; subtitle: string }> = {
  dosing: {
    title: 'Dosing Calculator',
    subtitle: 'Get the exact mL to dose for your tank volume.',
  },
  export: {
    title: 'CSV Export',
    subtitle: 'Export your history for ICP comparisons and forum help.',
  },
  'unlimited-tanks': {
    title: 'Unlimited Tanks',
    subtitle: 'Track every system — display, frag, and quarantine.',
  },
  'full-history': {
    title: 'Full History',
    subtitle: 'Keep every reading, forever — not just 30 days.',
  },
  'custom-parameters': {
    title: 'Custom Parameters',
    subtitle: 'Add your own test types and target ranges.',
  },
  'unlimited-reminders': {
    title: 'Unlimited Reminders',
    subtitle: 'Set a test reminder for every tank and parameter.',
  },
};

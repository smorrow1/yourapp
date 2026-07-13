import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { PremiumPlan } from '@/types';

/**
 * Thin wrapper around RevenueCat (react-native-purchases). Everything is loaded
 * lazily and guarded so the app still runs in Expo Go or when no API key is set —
 * in those cases each function returns `null` and callers fall back to the mock
 * purchase flow. The screens never import react-native-purchases directly.
 *
 * TODO before release:
 *  - Create the products/entitlement in App Store Connect + RevenueCat.
 *  - Set REVENUECAT_IOS_API_KEY / REVENUECAT_ANDROID_API_KEY (EAS env/secret).
 *  - Match PLAN_PRODUCT_IDS below to your configured product identifiers.
 */

const ENTITLEMENT_ID = 'pro';

export const PLAN_PRODUCT_IDS: Record<Exclude<PremiumPlan, 'free'>, string> = {
  lifetime: 'reefpilot_pro_lifetime',
  yearly: 'reefpilot_pro_yearly',
  monthly: 'reefpilot_pro_monthly',
};

function apiKey(): string | null {
  const extra = (Constants.expoConfig?.extra ?? {}) as any;
  const rc = extra.revenueCat ?? {};
  const key = Platform.OS === 'ios' ? rc.iosApiKey : rc.androidApiKey;
  return key && String(key).length > 0 ? String(key) : null;
}

/** True when a RevenueCat key is present for this platform. */
export function isIapConfigured(): boolean {
  return apiKey() !== null;
}

let purchasesRef: any = null;
let configured = false;

async function getPurchases(): Promise<any | null> {
  const key = apiKey();
  if (!key) return null;
  try {
    if (!purchasesRef) {
      purchasesRef = (await import('react-native-purchases')).default;
    }
    if (!configured) {
      await purchasesRef.configure({ apiKey: key });
      configured = true;
    }
    return purchasesRef;
  } catch {
    // Native module unavailable (e.g. Expo Go) — fall back to mock.
    return null;
  }
}

function hasPro(customerInfo: any): boolean {
  return Boolean(customerInfo?.entitlements?.active?.[ENTITLEMENT_ID]);
}

/** Returns current Pro status, or null when IAP isn't available. */
export async function initIap(): Promise<boolean | null> {
  const P = await getPurchases();
  if (!P) return null;
  try {
    return hasPro(await P.getCustomerInfo());
  } catch {
    return null;
  }
}

export type PurchaseResult = 'success' | 'cancelled' | 'error' | 'unavailable';

export async function purchasePlan(plan: Exclude<PremiumPlan, 'free'>): Promise<PurchaseResult> {
  const P = await getPurchases();
  if (!P) return 'unavailable';
  try {
    const productId = PLAN_PRODUCT_IDS[plan];
    const offerings = await P.getOfferings();
    const pkg =
      offerings?.current?.availablePackages?.find((p: any) => p.product?.identifier === productId) ?? null;
    if (!pkg) return 'error';
    const { customerInfo } = await P.purchasePackage(pkg);
    return hasPro(customerInfo) ? 'success' : 'error';
  } catch (e: any) {
    if (e?.userCancelled) return 'cancelled';
    return 'error';
  }
}

export type RestoreResult = 'restored' | 'none' | 'error' | 'unavailable';

export async function restorePurchases(): Promise<RestoreResult> {
  const P = await getPurchases();
  if (!P) return 'unavailable';
  try {
    return hasPro(await P.restorePurchases()) ? 'restored' : 'none';
  } catch {
    return 'error';
  }
}

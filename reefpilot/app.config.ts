import type { ConfigContext, ExpoConfig } from 'expo/config';

// `APP_VARIANT=development` builds a side-by-side dev app with its own bundle id,
// so you can keep a store build installed while testing.
const APP_VARIANT = process.env.APP_VARIANT ?? 'production';
const IS_DEV = APP_VARIANT === 'development';

// TODO: set this to a reverse-DNS id for a domain you control, then register the
// matching App ID in the Apple Developer portal and the package in Google Play.
const BUNDLE_ID = 'com.reefpilot.app';
const bundleId = IS_DEV ? `${BUNDLE_ID}.dev` : BUNDLE_ID;

const NAVY = '#0B1622';
const TEAL = '#21C0A6';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'ReefPilot Dev' : 'ReefPilot',
  slug: 'reefpilot',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'reefpilot',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  icon: './assets/icon.png',
  primaryColor: TEAL,
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: bundleId,
    buildNumber: '1',
    config: { usesNonExemptEncryption: false },
  },
  android: {
    package: bundleId,
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: NAVY,
    },
    permissions: ['android.permission.POST_NOTIFICATIONS'],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 220,
        resizeMode: 'contain',
        backgroundColor: NAVY,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: TEAL,
      },
    ],
    [
      'expo-build-properties',
      {
        ios: { deploymentTarget: '15.1' },
        android: { compileSdkVersion: 35, targetSdkVersion: 35, minSdkVersion: 24 },
      },
    ],
  ],
  extra: {
    // `eas init` fills this in; env var lets CI override.
    eas: { projectId: process.env.EAS_PROJECT_ID ?? undefined },
    // RevenueCat public SDK keys — safe to ship, but injected via env so they
    // aren't hard-coded. Empty => app runs with the mock purchase flow.
    revenueCat: {
      iosApiKey: process.env.REVENUECAT_IOS_API_KEY ?? '',
      androidApiKey: process.env.REVENUECAT_ANDROID_API_KEY ?? '',
    },
  },
});

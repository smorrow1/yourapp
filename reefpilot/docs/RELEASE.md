# Release runbook — App Store & Google Play

ReefPilot now uses native modules (RevenueCat), so it builds with **EAS**, not
Expo Go. This is the end-to-end path from a clean checkout to a store submission.

## 0. One-time accounts & tools

- [ ] Apple Developer Program membership ($99/yr) and an App Store Connect app record.
- [ ] Google Play Developer account ($25 one-time) — for Android.
- [ ] A RevenueCat account (free tier is fine).
- [ ] Install the CLI: `npm i -g eas-cli` and run `eas login`.

## 1. Configure identifiers & keys

- [ ] Pick a bundle id you own and set it in `app.config.ts` (`BUNDLE_ID`), then
      register the App ID in the Apple Developer portal and the package in Play.
- [ ] `eas init` — creates the EAS project. Because the config is a dynamic
      `app.config.ts`, EAS can't write the id into it: copy the printed project id
      into the `EAS_PROJECT_ID` env/secret (or hardcode it in `app.config.ts`).
- [ ] In App Store Connect, create the three IAPs from `docs/APP_STORE.md`.
- [ ] In RevenueCat, create the `pro` entitlement + offering with those products.
- [ ] Set the RevenueCat public keys as EAS env/secrets:
      `eas secret:create --name REVENUECAT_IOS_API_KEY --value <key>`
      (repeat for `REVENUECAT_ANDROID_API_KEY` if shipping Android).
- [ ] Fill the `submit.production.ios` fields in `eas.json` (Apple ID, ASC app id, team id).

## 2. Fill the remaining TODOs

Search the repo for `TODO`. Must-do before submission:

- [ ] Host `docs/PRIVACY.md` and `docs/TERMS.md` at public URLs; put them in the
      store listing and update `PRIVACY_URL` / `TERMS_URL` in `PrivacyScreen.tsx`.
- [ ] Support email in `FeedbackScreen.tsx` and effective dates in the legal docs.
- [ ] Verify the dosing preset strengths in `src/domain/dosing.ts` and the
      `FRESH_SALTWATER` values in `src/domain/parameters.ts`.
- [ ] Store listing copy, keywords, and screenshots (`docs/APP_STORE.md`).

## 3. Verify locally

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

Then smoke-test on a real build via a development client:

```bash
eas build --profile development --platform ios
# install the dev client on a device/simulator, then:
npx expo start --dev-client
```

> The mock purchase path only runs when no RevenueCat key is set. With keys
> configured, test purchases against the App Store **sandbox**.

## 4. Production build & submit

```bash
# iOS
eas build --profile production --platform ios
eas submit --profile production --platform ios --latest

# Android (optional)
eas build --profile production --platform android
eas submit --profile production --platform android --latest
```

- `production` uses `autoIncrement`, so build numbers bump automatically.
- Bump the user-facing `version` in `app.config.ts` for each release.

## 5. App Store Connect

- [ ] Attach the build, complete **App Privacy** answers (see `docs/APP_STORE.md`).
- [ ] Add screenshots, description, keywords, support/marketing/privacy URLs.
- [ ] Add the three IAPs to the app version and submit them **with** the build.
- [ ] Paste the reviewer notes from `docs/APP_STORE.md`.
- [ ] Submit for review.

## Recommended follow-ups (post-launch, not blockers)

- Crash reporting (e.g. Sentry) — wire it in `ErrorBoundary` and disclose it.
- EAS Update (OTA) for JS-only fixes.
- Automated screenshots (Fastlane) and a small e2e smoke test.

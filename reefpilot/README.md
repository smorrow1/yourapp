# ReefPilot 🌊

> Log your reef tank's water parameters, catch dangerous swings before your corals do, and dose with confidence.

A niche, offline-first mobile app for **saltwater reef-keeping hobbyists**. Built with Expo + React Native + TypeScript so it ships to both the App Store and Google Play from one codebase.

---

## Why this app

Reefers test water weekly and dose chemicals to keep corals alive. A single alkalinity swing can crash a tank worth thousands. Today they cobble this together in spreadsheets. ReefPilot makes logging take 30 seconds, colors every value against its target range, charts trends, and tells you exactly how much to dose.

## Monetization

Free core + **ReefPilot Pro** (lifetime unlock hero at $39.99, or $24.99/yr / $4.99/mo).

| Free | Pro |
| --- | --- |
| 1 tank, 30-day history, core params, status coloring, 14-day trends, 1 reminder | Unlimited tanks & history, **dosing calculator with consumption-based maintenance dosing**, CSV export, custom parameters, unlimited reminders |

> **Positioning vs. the field (e.g. ReefManager):** competitors go wide — AI assistant, community map, ICP ecosystem, hardware — and their reviews flag the cost: steep learning curve and resentment at gating basic logging behind a subscription. ReefPilot's wedge is the opposite: **fast, focused, logging always free**, with one genuinely high-value computed feature — estimating your tank's consumption rate from your own tests and recommending a steady maintenance dose.

Gating lives in [`src/lib/gating.ts`](src/lib/gating.ts). The paywall is a **soft** trigger fired on intent moments (open dosing, add 2nd tank, export) and once after the 3rd saved reading.

> IAP runs through **RevenueCat** ([`src/lib/iap.ts`](src/lib/iap.ts)), wired into
> [`usePremiumStore`](src/store/usePremiumStore.ts). With no API key configured it
> falls back to a local unlock so development works without a store account. See
> [`docs/RELEASE.md`](docs/RELEASE.md) to configure real products.

## Tech stack

- **Expo SDK 54** (managed, New Architecture) + **React Native 0.81** / **React 19** + **TypeScript**
  - Requires **Node 20.19.4+** (or 22.x) to run the dev server.
- **React Navigation** (bottom tabs + native stack)
- **Zustand** + `persist` → AsyncStorage (offline-first, **no backend, no auth**), with a launch-time hydration gate
- **RevenueCat** (`react-native-purchases`) for in-app purchases, behind a defensive abstraction
- **react-native-svg** for the trend chart (no heavy chart dep)
- **expo-notifications** for local test reminders; **ErrorBoundary** for crash safety

## Project structure

```
src/
  theme/        colors, spacing, typography
  types/        domain types
  domain/       parameters & target ranges, dosing presets, sample data
  store/        zustand stores (tanks, readings, premium, settings)
  lib/          gating limits, notifications, formatters
  components/   Button, Card, ParameterRow, TrendChart, EmptyState, ...
  navigation/   Root + Tab navigators
  screens/      Onboarding, TankList, AddReading, Trends, Dosing, Paywall, ...
```

## Run it locally

```bash
cd reefpilot
npm install
npm start          # press i (iOS sim), a (Android), or scan in Expo Go
```

Expo Go still works for day-to-day JS iteration — the RevenueCat native module
isn't present there, so purchases fall back to the local mock unlock. For **real
IAP and store builds** use an EAS dev/production build (see below).

Checks:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

## Building for the stores

The app uses native modules, so it builds with **EAS**, not Expo Go. Full
step-by-step: [`docs/RELEASE.md`](docs/RELEASE.md). Store listing copy and review
answers: [`docs/APP_STORE.md`](docs/APP_STORE.md).

```bash
npm i -g eas-cli && eas login
eas init                                   # sets extra.eas.projectId
eas build   --profile production --platform ios
eas submit  --profile production --platform ios --latest
```

## Before you publish — TODO checklist

Done in this pass: branded icons/splash, `app.config.ts` + `eas.json`, RevenueCat
wiring, hydration gate + ErrorBoundary, ESLint, legal docs, store kit.

Still requires **your** accounts/keys (see [`docs/RELEASE.md`](docs/RELEASE.md)) — search the codebase for `TODO`:

- [ ] Confirm `BUNDLE_ID` in `app.config.ts` is one you own; register App ID / package
- [ ] `eas init` (project id) + create the 3 IAPs and RevenueCat `pro` entitlement
- [ ] Set `REVENUECAT_IOS_API_KEY` (EAS secret)
- [ ] Host `docs/PRIVACY.md` + `docs/TERMS.md`; set URLs in `PrivacyScreen.tsx` and the listing
- [ ] Support email (`FeedbackScreen`)
- [ ] Verify dosing presets (`src/domain/dosing.ts`) and `FRESH_SALTWATER` (`src/domain/parameters.ts`)
- [ ] Screenshots + final listing copy (`docs/APP_STORE.md`)
- [ ] Optional: crash reporting SDK (wire into `ErrorBoundary`) + disclosure

## ASO positioning

- **Name:** `ReefPilot — Aquarium Water Log`
- **Subtitle:** `Track parameters, dose & avoid crashes`
- **Keywords:** reef tank, aquarium log, water parameters, alkalinity tracker, saltwater, coral, dosing calculator, salinity, nitrate, reefkeeping

## Disclaimer

ReefPilot's dosing calculator is an **informational helper only** — always follow your product's label, dose gradually, and re-test. It is not a substitute for professional advice.

## Roadmap

- **Shipped** — dose & water-change logging (`Log dose / water change`); the consumption estimate nets out logged doses **and** models how each water change shifts a parameter toward fresh saltwater (`FRESH_SALTWATER` reference values); **CSV export** of a tank's readings via the system share sheet (Pro).
- **v1.1** — custom parameters & ranges, per-salt-brand fresh-water values, save your own dosing products, ICP CSV import.
- **v1.2** — optional encrypted cloud backup/sync (same store interface), Apple Health-style streaks, shareable tank report.

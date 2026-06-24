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
| 1 tank, 30-day history, core params, status coloring, 14-day trends, 1 reminder | Unlimited tanks & history, **dosing calculator**, CSV export, custom parameters, unlimited reminders |

Gating lives in [`src/lib/gating.ts`](src/lib/gating.ts). The paywall is a **soft** trigger fired on intent moments (open dosing, add 2nd tank, export) and once after the 3rd saved reading.

> Payments are mocked in [`src/store/usePremiumStore.ts`](src/store/usePremiumStore.ts). Search for `TODO` to wire up **RevenueCat** before release.

## Tech stack

- **Expo SDK 54** (managed, New Architecture) + **React Native 0.81** / **React 19** + **TypeScript**
  - Requires **Node 20.19.4+** (or 22.x) to run the dev server.
- **React Navigation** (bottom tabs + native stack)
- **Zustand** + `persist` → AsyncStorage (offline-first, **no backend, no auth**)
- **react-native-svg** for the trend chart (no heavy chart dep)
- **expo-notifications** for local test reminders

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
npm start          # then press i (iOS sim), a (Android), or scan in Expo Go
```

Type-check:

```bash
npm run typecheck
```

> The `assets/` folder ships with a README but no images yet — see [`assets/README.md`](assets/README.md). In dev Expo will boot anyway; add icons before building for the stores.

## Before you publish — TODO checklist

Search the codebase for `TODO`. Key items:

- [ ] App icons & splash (`assets/`, `app.json`)
- [ ] Set real `bundleIdentifier` / `package` in `app.json`
- [ ] Integrate **RevenueCat** (replace mock purchase/restore in `usePremiumStore`)
- [ ] Verify dosing preset strengths vs. manufacturer labels (`src/domain/dosing.ts`)
- [ ] Real Privacy Policy + Terms URLs (`PrivacyScreen`, `PaywallScreen`)
- [ ] Support email (`FeedbackScreen`)
- [ ] Analytics/crash SDK + disclosure (optional)
- [ ] App Store / Play metadata & screenshots (see ASO notes below)

## ASO positioning

- **Name:** `ReefPilot — Aquarium Water Log`
- **Subtitle:** `Track parameters, dose & avoid crashes`
- **Keywords:** reef tank, aquarium log, water parameters, alkalinity tracker, saltwater, coral, dosing calculator, salinity, nitrate, reefkeeping

## Disclaimer

ReefPilot's dosing calculator is an **informational helper only** — always follow your product's label, dose gradually, and re-test. It is not a substitute for professional advice.

## Roadmap

- **v1.1** — custom parameters & ranges, save your own dosing products, ICP CSV import.
- **v1.2** — optional encrypted cloud backup/sync (same store interface), Apple Health-style streaks, shareable tank report.

# App Store / Play Store listing kit

Copy-paste source for the store listings, plus the review answers. Fill every
`TODO` before submitting.

## Identity

- **Name:** ReefPilot
- **Subtitle (iOS, ≤30 chars):** Aquarium water log & dosing
- **Promotional text (iOS, ≤170):** Log your reef’s water in 30 seconds, catch dangerous swings early, and know exactly how much to dose. Built for saltwater reef keepers.
- **Category:** Primary: Utilities · Secondary: Lifestyle
- **Bundle ID:** `com.reefpilot.app`  ← TODO confirm you own this
- **Age rating:** 4+ (no objectionable content)
- **Support URL:** https://TODO.example.com/support
- **Marketing URL (optional):** https://TODO.example.com

## Keywords (iOS, ≤100 chars, comma-separated)

`reef,aquarium,saltwater,water,parameters,alkalinity,dosing,coral,salinity,nitrate,reefkeeping,tank`

## Description

> ReefPilot is the fastest way to log your reef tank’s water parameters, catch a
> dangerous swing before your corals do, and dose with confidence.
>
> Built for saltwater reef keepers — not a generic note app.
>
> • LOG IN SECONDS — Alkalinity, calcium, magnesium, salinity, pH, nitrate,
>   phosphate and more, with values prefilled from your last test.
> • INSTANT STATUS — Every reading is colored against reef target ranges so you
>   see what’s in and out of range at a glance.
> • TREND CHARTS — Spot a parameter drifting before it becomes a crash.
> • SMART DOSING (Pro) — Get the exact mL to dose for your tank volume, plus your
>   tank’s measured consumption rate and a steady maintenance dose.
> • DOSE & WATER-CHANGE LOG (Pro math) — Keeps your consumption estimate accurate
>   even while you actively dose.
> • CSV EXPORT (Pro) — Share your history for ICP comparisons and forum help.
> • OFFLINE & PRIVATE — No account required. Your data stays on your device.
>
> ReefPilot Pro unlocks unlimited tanks, full history, the dosing calculator,
> CSV export, custom ranges, and unlimited reminders. Available as a one-time
> lifetime unlock or a subscription.
>
> Dosing figures are informational estimates — always follow your product label,
> dose gradually, and re-test.

## What’s New (first release)

`First release of ReefPilot — log water parameters, track trends, and calculate dosing for your reef tank.`

## In-app purchases to create (App Store Connect + RevenueCat)

Entitlement identifier: **`pro`**. Product identifiers must match
`src/lib/iap.ts` → `PLAN_PRODUCT_IDS`:

| Plan | Product ID | Type | Price (TODO confirm) |
| --- | --- | --- | --- |
| Lifetime | `reefpilot_pro_lifetime` | Non-consumable | $39.99 |
| Yearly | `reefpilot_pro_yearly` | Auto-renewable subscription | $24.99/yr |
| Monthly | `reefpilot_pro_monthly` | Auto-renewable subscription | $4.99/mo |

In RevenueCat: add all three to an **Offering** and attach them to the `pro`
entitlement. Put the iOS public SDK key in `REVENUECAT_IOS_API_KEY`.

## App Privacy answers (iOS "App Privacy" / Play Data safety)

- Data collected by the developer: **None** (aquarium data is on-device only).
- Tracking: **No**.
- Purchases are processed by Apple/Google; RevenueCat receives an anonymous app
  user ID + purchase metadata (disclose under "Purchases" if prompted).
- If you later add analytics/crash reporting, update these answers.

## App Review notes (paste into "Notes for Reviewer")

> No login required — open the app and tap through onboarding.
> To review paid features: open any tank → tap "Dose" (or a parameter) to reach
> the paywall, then complete a sandbox purchase of "Lifetime". Alternatively,
> subscriptions can be reviewed with a sandbox account.
> All data is stored locally; the app works fully offline.

## Screenshots to produce (per required device size)

1. Tank dashboard — "Log your reef in 30 seconds"
2. Add reading with status coloring — "See what’s out of range instantly"
3. Trend chart — "Catch swings before your corals do"
4. Dosing calculator + consumption — "Know exactly how much to dose"
5. Paywall — "Everything you need to protect your reef"

> Generate with the iOS Simulator (Cmd+S) at the required resolutions, or a tool
> like Fastlane snapshot. TODO: capture and upload.

import type { ParameterKey, Reading, TankEvent } from '@/types';
import { PARAMETERS_BY_KEY } from './parameters';
import { DOSING_PRODUCTS, type DosingProduct } from './dosing';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface ConsumptionEstimate {
  /** Average daily decrease in the parameter's own unit (e.g. dKH/day). */
  perDay: number | null;
  /** How many usable intervals fed the estimate. */
  intervals: number;
  /** Intervals ignored because a water change happened in them. */
  skippedForWaterChange: number;
}

export interface ConsumptionInput {
  readings: Reading[];
  key: ParameterKey;
  /** Needed to convert logged dose mL back into parameter units. */
  volumeGallons: number;
  events?: TankEvent[];
}

/** Parameter-unit rise produced by doses of `key` logged within (start, end]. */
function riseFromDoses(
  events: TankEvent[],
  key: ParameterKey,
  start: number,
  end: number,
  volumeGallons: number,
): number {
  if (volumeGallons <= 0) return 0;
  let rise = 0;
  for (const ev of events) {
    if (ev.type !== 'dose' || ev.paramKey !== key || ev.amountMl == null) continue;
    const t = new Date(ev.at).getTime();
    if (t <= start || t > end) continue;
    const product: DosingProduct | undefined = DOSING_PRODUCTS.find((p) => p.id === ev.productId);
    if (!product) continue;
    // dose_mL = mlPerGalPerUnit * gal * deltaUnits  =>  deltaUnits = dose_mL / (mlPerGalPerUnit * gal)
    rise += ev.amountMl / (product.mlPerGalPerUnit * volumeGallons);
  }
  return rise;
}

/**
 * Estimate a tank's average daily uptake ("consumption") of a parameter from its
 * own test history — the core of "intelligent dosing instead of guessing".
 *
 * For each interval between two tests:
 *   consumed = (startValue + doses added in the interval) - endValue
 * Logged doses are netted out, so the estimate stays accurate even while you dose.
 * Intervals containing a water change are skipped, since a water change shifts the
 * value toward fresh-saltwater levels and would confound the uptake math.
 *
 * Returns perDay = null when no usable interval shows net consumption.
 */
export function estimateDailyConsumption({
  readings,
  key,
  volumeGallons,
  events = [],
}: ConsumptionInput): ConsumptionEstimate {
  const points = readings
    .filter((r) => r.values[key] !== undefined)
    .map((r) => ({ t: new Date(r.takenAt).getTime(), v: r.values[key] as number }))
    .sort((a, b) => a.t - b.t);

  if (points.length < 2) return { perDay: null, intervals: 0, skippedForWaterChange: 0 };

  let totalConsumed = 0;
  let totalDays = 0;
  let intervals = 0;
  let skipped = 0;

  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1].t;
    const end = points[i].t;
    const days = (end - start) / MS_PER_DAY;
    if (days <= 0) continue;

    const hasWaterChange = events.some(
      (e) => e.type === 'waterChange' && new Date(e.at).getTime() > start && new Date(e.at).getTime() <= end,
    );
    if (hasWaterChange) {
      skipped += 1;
      continue;
    }

    const dosed = riseFromDoses(events, key, start, end, volumeGallons);
    const consumed = points[i - 1].v + dosed - points[i].v;
    if (consumed > 0) {
      totalConsumed += consumed;
      totalDays += days;
      intervals += 1;
    }
  }

  if (intervals === 0 || totalDays === 0) {
    return { perDay: null, intervals: 0, skippedForWaterChange: skipped };
  }
  return { perDay: totalConsumed / totalDays, intervals, skippedForWaterChange: skipped };
}

/** mL of product per day needed to offset the measured daily consumption. */
export function maintenanceDosePerDay(product: DosingProduct, volumeGallons: number, perDay: number): number {
  const ml = product.mlPerGalPerUnit * volumeGallons * perDay;
  return Math.round(ml * 10) / 10;
}

/**
 * Suggest how many days until the next test: roughly the time for the parameter
 * to drift across its ideal band at the current consumption rate (clamped 1–14).
 */
export function suggestNextTestDays(key: ParameterKey, perDay: number): number {
  const def = PARAMETERS_BY_KEY[key];
  const band = Math.max(def.max - def.min, def.step);
  if (perDay <= 0) return 14;
  return Math.min(14, Math.max(1, Math.round(band / perDay)));
}

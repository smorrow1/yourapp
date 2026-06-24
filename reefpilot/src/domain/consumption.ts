import type { ParameterKey, Reading, TankEvent } from '@/types';
import { FRESH_SALTWATER, PARAMETERS_BY_KEY } from './parameters';
import { DOSING_PRODUCTS, type DosingProduct } from './dosing';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface ConsumptionEstimate {
  /** Average daily decrease in the parameter's own unit (e.g. dKH/day). */
  perDay: number | null;
  /** How many usable intervals fed the estimate. */
  intervals: number;
  /** Intervals whose water change(s) were modeled and netted out. */
  waterChangesModeled: number;
  /** Intervals skipped because a water change couldn't be modeled (no reference value). */
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
 * Parameter-unit change produced by water change(s) of `key` within (start, end].
 * A water change of fraction f moves the value toward fresh saltwater:
 *   delta = f * (freshValue - valueBeforeChange)
 * We approximate valueBeforeChange with the interval's starting value.
 * Returns null when no reference (fresh) value exists for the parameter — the
 * caller then skips the interval rather than guess.
 */
function changeFromWaterChanges(
  events: TankEvent[],
  key: ParameterKey,
  start: number,
  end: number,
  startValue: number,
): { delta: number; count: number } | null {
  const inInterval = events.filter(
    (e) => e.type === 'waterChange' && new Date(e.at).getTime() > start && new Date(e.at).getTime() <= end,
  );
  if (inInterval.length === 0) return { delta: 0, count: 0 };

  const fresh = FRESH_SALTWATER[key];
  if (fresh === undefined) return null;

  let delta = 0;
  for (const ev of inInterval) {
    const f = Math.min(Math.max((ev.percent ?? 0) / 100, 0), 1);
    delta += f * (fresh - startValue);
  }
  return { delta, count: inInterval.length };
}

/**
 * Estimate a tank's average daily uptake ("consumption") of a parameter from its
 * own test history — the core of "intelligent dosing instead of guessing".
 *
 * For each interval between two tests:
 *   consumed = startValue + dosesAdded + waterChangeShift - endValue
 * Logged doses and water changes are both netted out, so the estimate stays
 * accurate even while you actively dose and do water changes. An interval is only
 * skipped when a water change can't be modeled (no reference value for the param).
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

  const empty: ConsumptionEstimate = {
    perDay: null,
    intervals: 0,
    waterChangesModeled: 0,
    skippedForWaterChange: 0,
  };
  if (points.length < 2) return empty;

  let totalConsumed = 0;
  let totalDays = 0;
  let intervals = 0;
  let modeled = 0;
  let skipped = 0;

  for (let i = 1; i < points.length; i++) {
    const start = points[i - 1].t;
    const end = points[i].t;
    const days = (end - start) / MS_PER_DAY;
    if (days <= 0) continue;

    const startValue = points[i - 1].v;
    const wc = changeFromWaterChanges(events, key, start, end, startValue);
    if (wc === null) {
      skipped += 1;
      continue;
    }

    const dosed = riseFromDoses(events, key, start, end, volumeGallons);
    const consumed = startValue + dosed + wc.delta - points[i].v;
    if (consumed > 0) {
      totalConsumed += consumed;
      totalDays += days;
      intervals += 1;
      if (wc.count > 0) modeled += 1;
    }
  }

  if (intervals === 0 || totalDays === 0) {
    return { ...empty, skippedForWaterChange: skipped };
  }
  return {
    perDay: totalConsumed / totalDays,
    intervals,
    waterChangesModeled: modeled,
    skippedForWaterChange: skipped,
  };
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

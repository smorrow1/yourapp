import type { ParameterKey, Reading } from '@/types';
import { PARAMETERS_BY_KEY } from './parameters';
import type { DosingProduct } from './dosing';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface ConsumptionEstimate {
  /** Average daily decrease in the parameter's own unit (e.g. dKH/day). */
  perDay: number | null;
  /** How many declining intervals fed the estimate. */
  intervals: number;
}

/**
 * Estimate a tank's average daily uptake ("consumption") of a parameter from its
 * own test history — the core idea behind "intelligent dosing instead of guessing".
 *
 * Only intervals where the value DROPPED are counted: a rise implies a dose or
 * water change between tests, which we can't yet model (no dose log in the MVP).
 * Returns perDay = null when there aren't enough declining intervals.
 */
export function estimateDailyConsumption(readings: Reading[], key: ParameterKey): ConsumptionEstimate {
  const points = readings
    .filter((r) => r.values[key] !== undefined)
    .map((r) => ({ t: new Date(r.takenAt).getTime(), v: r.values[key] as number }))
    .sort((a, b) => a.t - b.t);

  if (points.length < 2) return { perDay: null, intervals: 0 };

  let totalDrop = 0;
  let totalDays = 0;
  let intervals = 0;

  for (let i = 1; i < points.length; i++) {
    const days = (points[i].t - points[i - 1].t) / MS_PER_DAY;
    if (days <= 0) continue;
    const drop = points[i - 1].v - points[i].v; // positive => consumed
    if (drop > 0) {
      totalDrop += drop;
      totalDays += days;
      intervals += 1;
    }
  }

  if (intervals === 0 || totalDays === 0) return { perDay: null, intervals: 0 };
  return { perDay: totalDrop / totalDays, intervals };
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

import type { ParameterKey } from '@/types';

/**
 * Informational dosing helper only — NOT a substitute for the dosing instructions
 * printed on your product. Strength values below are approximate starting points.
 * TODO: verify each preset against the manufacturer label before relying on it,
 * and let users save their own products (v1.1).
 *
 * Model: `mlPerGalPerUnit` = mL of product, per US gallon of system water,
 * required to raise the target parameter by 1 unit.
 *   dose_mL = mlPerGalPerUnit * volumeGallons * (target - current)
 */
export interface DosingProduct {
  id: string;
  name: string;
  parameter: ParameterKey;
  unit: string;
  mlPerGalPerUnit: number;
}

export const DOSING_PRODUCTS: DosingProduct[] = [
  {
    id: 'generic-alk-soda',
    name: 'Generic Two-Part — Alkalinity',
    parameter: 'alkalinity',
    unit: 'dKH',
    mlPerGalPerUnit: 0.6,
  },
  {
    id: 'generic-cal',
    name: 'Generic Two-Part — Calcium',
    parameter: 'calcium',
    unit: 'ppm',
    mlPerGalPerUnit: 0.012,
  },
  {
    id: 'generic-mag',
    name: 'Generic Magnesium Supplement',
    parameter: 'magnesium',
    unit: 'ppm',
    mlPerGalPerUnit: 0.02,
  },
];

export interface DoseInput {
  product: DosingProduct;
  volumeGallons: number;
  current: number;
  target: number;
}

export interface DoseResult {
  /** Positive mL to add. 0 when current >= target (you cannot remove with a dose). */
  doseMl: number;
  delta: number;
  needsReduction: boolean;
}

export function calculateDose({ product, volumeGallons, current, target }: DoseInput): DoseResult {
  const delta = target - current;
  if (delta <= 0) {
    return { doseMl: 0, delta, needsReduction: delta < 0 };
  }
  const doseMl = product.mlPerGalPerUnit * volumeGallons * delta;
  return { doseMl: Math.round(doseMl * 10) / 10, delta, needsReduction: false };
}

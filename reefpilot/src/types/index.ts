export type ParameterKey =
  | 'temp'
  | 'salinity'
  | 'ph'
  | 'alkalinity'
  | 'calcium'
  | 'magnesium'
  | 'nitrate'
  | 'phosphate'
  | 'ammonia'
  | 'nitrite';

export type ParameterCategory = 'vital' | 'major' | 'nutrient';

export interface ParameterDef {
  key: ParameterKey;
  label: string;
  short: string;
  unit: string;
  /** Ideal target range — values inside are "good". */
  min: number;
  max: number;
  /** Acceptable bounds — outside ideal but inside warn = "warn", outside = "danger". */
  warnMin: number;
  warnMax: number;
  step: number;
  decimals: number;
  category: ParameterCategory;
  /** Whether this parameter can be dosed via the dosing calculator. */
  dosable?: boolean;
}

export type ParameterStatus = 'good' | 'warn' | 'danger' | 'empty';

export type TankType = 'reef' | 'fowlr' | 'nano' | 'frag';

export interface Tank {
  id: string;
  name: string;
  volumeGallons: number;
  type: TankType;
  createdAt: string;
}

export interface Reading {
  id: string;
  tankId: string;
  takenAt: string; // ISO timestamp
  values: Partial<Record<ParameterKey, number>>;
  note?: string;
}

export type UnitSystem = 'imperial' | 'metric';

export type TankEventType = 'dose' | 'waterChange';

/** A logged action on a tank — used to keep consumption estimates honest. */
export interface TankEvent {
  id: string;
  tankId: string;
  at: string; // ISO timestamp
  type: TankEventType;
  /** Dose: which parameter was dosed, with what product and how many mL. */
  paramKey?: ParameterKey;
  productId?: string;
  amountMl?: number;
  /** Water change: percent of system volume replaced. */
  percent?: number;
  note?: string;
}

export type PremiumPlan = 'free' | 'lifetime' | 'monthly' | 'yearly';

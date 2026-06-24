import type { ParameterDef, ParameterKey, ParameterStatus } from '@/types';

/**
 * Reef-keeping target ranges. These reflect commonly cited mixed-reef targets.
 * TODO: let Pro users override ranges per-tank (custom parameters in v1.1).
 */
export const PARAMETERS: ParameterDef[] = [
  {
    key: 'temp',
    label: 'Temperature',
    short: 'Temp',
    unit: '°F',
    min: 76,
    max: 78,
    warnMin: 74,
    warnMax: 80,
    step: 0.1,
    decimals: 1,
    category: 'vital',
  },
  {
    key: 'salinity',
    label: 'Salinity',
    short: 'Sal',
    unit: 'ppt',
    min: 34,
    max: 35,
    warnMin: 33,
    warnMax: 36,
    step: 0.1,
    decimals: 1,
    category: 'vital',
  },
  {
    key: 'ph',
    label: 'pH',
    short: 'pH',
    unit: '',
    min: 7.9,
    max: 8.4,
    warnMin: 7.7,
    warnMax: 8.5,
    step: 0.01,
    decimals: 2,
    category: 'vital',
  },
  {
    key: 'alkalinity',
    label: 'Alkalinity',
    short: 'Alk',
    unit: 'dKH',
    min: 8,
    max: 9,
    warnMin: 7,
    warnMax: 11,
    step: 0.1,
    decimals: 1,
    category: 'major',
    dosable: true,
  },
  {
    key: 'calcium',
    label: 'Calcium',
    short: 'Ca',
    unit: 'ppm',
    min: 400,
    max: 450,
    warnMin: 380,
    warnMax: 480,
    step: 5,
    decimals: 0,
    category: 'major',
    dosable: true,
  },
  {
    key: 'magnesium',
    label: 'Magnesium',
    short: 'Mg',
    unit: 'ppm',
    min: 1250,
    max: 1350,
    warnMin: 1200,
    warnMax: 1450,
    step: 5,
    decimals: 0,
    category: 'major',
    dosable: true,
  },
  {
    key: 'nitrate',
    label: 'Nitrate',
    short: 'NO₃',
    unit: 'ppm',
    min: 2,
    max: 10,
    warnMin: 0,
    warnMax: 20,
    step: 0.5,
    decimals: 1,
    category: 'nutrient',
  },
  {
    key: 'phosphate',
    label: 'Phosphate',
    short: 'PO₄',
    unit: 'ppm',
    min: 0.03,
    max: 0.1,
    warnMin: 0,
    warnMax: 0.2,
    step: 0.01,
    decimals: 2,
    category: 'nutrient',
  },
  {
    key: 'ammonia',
    label: 'Ammonia',
    short: 'NH₃',
    unit: 'ppm',
    min: 0,
    max: 0,
    warnMin: 0,
    warnMax: 0.25,
    step: 0.05,
    decimals: 2,
    category: 'nutrient',
  },
  {
    key: 'nitrite',
    label: 'Nitrite',
    short: 'NO₂',
    unit: 'ppm',
    min: 0,
    max: 0,
    warnMin: 0,
    warnMax: 0.5,
    step: 0.05,
    decimals: 2,
    category: 'nutrient',
  },
];

export const PARAMETERS_BY_KEY: Record<ParameterKey, ParameterDef> = PARAMETERS.reduce(
  (acc, p) => {
    acc[p.key] = p;
    return acc;
  },
  {} as Record<ParameterKey, ParameterDef>,
);

/** The parameters surfaced by default in the free tier add-reading flow. */
export const CORE_PARAMETER_KEYS: ParameterKey[] = [
  'temp',
  'salinity',
  'ph',
  'alkalinity',
  'calcium',
  'magnesium',
  'nitrate',
  'phosphate',
];

export function getStatus(key: ParameterKey, value: number | undefined): ParameterStatus {
  if (value === undefined || Number.isNaN(value)) return 'empty';
  const p = PARAMETERS_BY_KEY[key];
  if (value >= p.min && value <= p.max) return 'good';
  if (value >= p.warnMin && value <= p.warnMax) return 'warn';
  return 'danger';
}

export function formatValue(key: ParameterKey, value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return '—';
  const p = PARAMETERS_BY_KEY[key];
  return value.toFixed(p.decimals);
}

import type { Reading, Tank } from '@/types';

/** Seed used the very first launch so the app never opens empty during the demo. */
export const SAMPLE_TANK: Tank = {
  id: 'sample-tank',
  name: 'Living Room 75g',
  volumeGallons: 75,
  type: 'reef',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
};

function daysAgo(n: number): string {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();
}

export const SAMPLE_READINGS: Reading[] = [
  {
    id: 'r1',
    tankId: 'sample-tank',
    takenAt: daysAgo(21),
    values: { temp: 77.4, salinity: 35, ph: 8.1, alkalinity: 8.4, calcium: 430, magnesium: 1320, nitrate: 6, phosphate: 0.05 },
  },
  {
    id: 'r2',
    tankId: 'sample-tank',
    takenAt: daysAgo(14),
    values: { temp: 77.6, salinity: 34.8, ph: 8.05, alkalinity: 7.9, calcium: 420, magnesium: 1300, nitrate: 9, phosphate: 0.07 },
  },
  {
    id: 'r3',
    tankId: 'sample-tank',
    takenAt: daysAgo(7),
    values: { temp: 78.1, salinity: 35, ph: 8.0, alkalinity: 7.4, calcium: 405, magnesium: 1290, nitrate: 12, phosphate: 0.09 },
  },
  {
    id: 'r4',
    tankId: 'sample-tank',
    takenAt: daysAgo(1),
    values: { temp: 77.8, salinity: 35, ph: 8.12, alkalinity: 8.6, calcium: 435, magnesium: 1330, nitrate: 7, phosphate: 0.04 },
  },
];

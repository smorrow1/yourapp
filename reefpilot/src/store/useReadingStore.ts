import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { uid } from '@/lib/format';
import { SAMPLE_READINGS } from '@/domain/sampleData';
import type { ParameterKey, Reading } from '@/types';

interface ReadingState {
  readings: Reading[];
  addReading: (input: Omit<Reading, 'id'>) => Reading;
  removeReading: (id: string) => void;
  readingsForTank: (tankId: string) => Reading[];
  latestForTank: (tankId: string) => Reading | undefined;
  seriesForParam: (tankId: string, key: ParameterKey) => { takenAt: string; value: number }[];
}

function byNewest(a: Reading, b: Reading) {
  return new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime();
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      readings: SAMPLE_READINGS,

      addReading: (input) => {
        const reading: Reading = { ...input, id: uid() };
        set((s) => ({ readings: [...s.readings, reading] }));
        return reading;
      },

      removeReading: (id) =>
        set((s) => ({ readings: s.readings.filter((r) => r.id !== id) })),

      readingsForTank: (tankId) =>
        get().readings.filter((r) => r.tankId === tankId).sort(byNewest),

      latestForTank: (tankId) =>
        get().readings.filter((r) => r.tankId === tankId).sort(byNewest)[0],

      seriesForParam: (tankId, key) =>
        get()
          .readings.filter((r) => r.tankId === tankId && r.values[key] !== undefined)
          .sort((a, b) => new Date(a.takenAt).getTime() - new Date(b.takenAt).getTime())
          .map((r) => ({ takenAt: r.takenAt, value: r.values[key] as number })),
    }),
    { name: 'reefpilot.readings', storage: zustandStorage },
  ),
);

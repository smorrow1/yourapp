import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { uid } from '@/lib/format';
import { SAMPLE_TANK } from '@/domain/sampleData';
import type { Tank } from '@/types';

interface TankState {
  tanks: Tank[];
  selectedTankId: string | null;
  addTank: (input: Omit<Tank, 'id' | 'createdAt'>) => Tank;
  updateTank: (id: string, patch: Partial<Omit<Tank, 'id'>>) => void;
  removeTank: (id: string) => void;
  selectTank: (id: string) => void;
}

export const useTankStore = create<TankState>()(
  persist(
    (set, get) => ({
      tanks: [SAMPLE_TANK],
      selectedTankId: SAMPLE_TANK.id,

      addTank: (input) => {
        const tank: Tank = { ...input, id: uid(), createdAt: new Date().toISOString() };
        set((s) => ({ tanks: [...s.tanks, tank], selectedTankId: tank.id }));
        return tank;
      },

      updateTank: (id, patch) =>
        set((s) => ({
          tanks: s.tanks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      removeTank: (id) =>
        set((s) => {
          const tanks = s.tanks.filter((t) => t.id !== id);
          const selectedTankId =
            s.selectedTankId === id ? tanks[0]?.id ?? null : s.selectedTankId;
          return { tanks, selectedTankId };
        }),

      selectTank: (id) => {
        if (get().tanks.some((t) => t.id === id)) set({ selectedTankId: id });
      },
    }),
    { name: 'reefpilot.tanks', storage: zustandStorage },
  ),
);

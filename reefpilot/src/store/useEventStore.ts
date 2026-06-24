import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { uid } from '@/lib/format';
import { SAMPLE_EVENTS } from '@/domain/sampleData';
import type { TankEvent } from '@/types';

interface EventState {
  events: TankEvent[];
  addEvent: (input: Omit<TankEvent, 'id'>) => TankEvent;
  removeEvent: (id: string) => void;
  removeEventsForTank: (tankId: string) => void;
  eventsForTank: (tankId: string) => TankEvent[];
}

function byNewest(a: TankEvent, b: TankEvent) {
  return new Date(b.at).getTime() - new Date(a.at).getTime();
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: SAMPLE_EVENTS,

      addEvent: (input) => {
        const event: TankEvent = { ...input, id: uid() };
        set((s) => ({ events: [...s.events, event] }));
        return event;
      },

      removeEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      removeEventsForTank: (tankId) =>
        set((s) => ({ events: s.events.filter((e) => e.tankId !== tankId) })),

      eventsForTank: (tankId) => get().events.filter((e) => e.tankId === tankId).sort(byNewest),
    }),
    { name: 'reefpilot.events', storage: zustandStorage },
  ),
);

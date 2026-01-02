import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { storage } from '@lib/storage';
import { TOTAL_STEPS, JOURNEY_STORAGE_KEY } from '../constants';
import type { JourneyState, JourneyActions } from '../types';

type JourneyStore = JourneyState & JourneyActions;

const initialState: JourneyState = {
  currentStepIndex: 0,
  maxStepReached: 0,
  isComplete: false,
  direction: 1,
};

/**
 * Global journey state store with localStorage persistence.
 * Tracks user progress through the 14-step journey flow.
 */
export const useJourneyStore = create<JourneyStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      next: (): void => {
        const { currentStepIndex, maxStepReached } = get();
        const nextIndex = currentStepIndex + 1;

        if (nextIndex < TOTAL_STEPS) {
          set({
            currentStepIndex: nextIndex,
            maxStepReached: Math.max(maxStepReached, nextIndex),
            direction: 1,
          });
        }
      },

      prev: (): void => {
        const { currentStepIndex } = get();
        const prevIndex = currentStepIndex - 1;

        if (prevIndex >= 0) {
          set({
            currentStepIndex: prevIndex,
            direction: -1,
          });
        }
      },

      goTo: (index: number): void => {
        if (index >= 0 && index < TOTAL_STEPS) {
          const { maxStepReached, currentStepIndex } = get();
          set({
            currentStepIndex: index,
            maxStepReached: Math.max(maxStepReached, index),
            direction: index > currentStepIndex ? 1 : -1,
          });
        }
      },

      markComplete: (): void => {
        set({
          isComplete: true,
          maxStepReached: TOTAL_STEPS - 1,
        });
      },

      reset: (): void => {
        set(initialState);
      },
    }),
    {
      name: JOURNEY_STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name: string): string | null => storage.getItem(name),
        setItem: (name: string, value: string): void => {
          storage.setItem(name, value);
        },
        removeItem: (name: string): void => {
          storage.removeItem(name);
        },
      })),
      partialize: (state): JourneyState => ({
        currentStepIndex: state.currentStepIndex,
        maxStepReached: state.maxStepReached,
        isComplete: state.isComplete,
        direction: state.direction,
      }),
    }
  )
);

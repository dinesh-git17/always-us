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
 * Subset of journey state that persists across app launches.
 * currentStepIndex and direction are intentionally NOT persisted
 * so the user always starts at the Welcome page with fresh animations.
 */
interface PersistedJourneyState {
  maxStepReached: number;
  isComplete: boolean;
}

/**
 * Global journey state store with localStorage persistence.
 * Tracks user progress through the 14-step journey flow.
 *
 * Design note: Only maxStepReached and isComplete are persisted.
 * The app always starts at step 0 (Welcome) so users experience
 * the entrance animation on each launch.
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
      // Only persist progress ceiling and completion status.
      // currentStepIndex always resets to 0 on app launch.
      partialize: (state): PersistedJourneyState => ({
        maxStepReached: state.maxStepReached,
        isComplete: state.isComplete,
      }),
    }
  )
);

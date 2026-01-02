import { useCallback, useMemo } from 'react';

import { useJourneyStore } from '../store/journeyStore';
import { TOTAL_STEPS } from '../constants';
import type { NavigationContext } from '../types';

/**
 * Hook that provides navigation context and actions for child components.
 * Abstracts away the journey store implementation details.
 */
export function useNavigation(): NavigationContext {
  const currentStepIndex = useJourneyStore((state) => state.currentStepIndex);
  const isComplete = useJourneyStore((state) => state.isComplete);
  const direction = useJourneyStore((state) => state.direction);
  const storeNext = useJourneyStore((state) => state.next);
  const storePrev = useJourneyStore((state) => state.prev);
  const storeGoTo = useJourneyStore((state) => state.goTo);

  const canGoNext = currentStepIndex < TOTAL_STEPS - 1;
  const canGoPrev = currentStepIndex > 0;

  const next = useCallback((): void => {
    if (canGoNext) {
      storeNext();
    }
  }, [canGoNext, storeNext]);

  const prev = useCallback((): void => {
    if (canGoPrev) {
      storePrev();
    }
  }, [canGoPrev, storePrev]);

  const goTo = useCallback(
    (index: number): void => {
      if (index >= 0 && index < TOTAL_STEPS) {
        storeGoTo(index);
      }
    },
    [storeGoTo]
  );

  return useMemo(
    (): NavigationContext => ({
      currentStepIndex,
      totalSteps: TOTAL_STEPS,
      canGoNext,
      canGoPrev,
      isComplete,
      direction,
      next,
      prev,
      goTo,
    }),
    [currentStepIndex, canGoNext, canGoPrev, isComplete, direction, next, prev, goTo]
  );
}

import { useRef, useCallback, type PointerEvent } from 'react';

import { SWIPE_THRESHOLD_DISTANCE, SWIPE_THRESHOLD_VELOCITY, SWIPE_EDGE_ZONE } from '../constants';

export interface UseSwipeGestureOptions {
  /** Callback when user swipes left (forward navigation) */
  onSwipeLeft?: () => void;
  /** Callback when user swipes right (backward navigation) */
  onSwipeRight?: () => void;
  /** Whether swipe gestures are enabled */
  enabled?: boolean;
}

export interface SwipeHandlers {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  isTracking: boolean;
}

/**
 * Hook for handling horizontal swipe gestures on touch devices.
 * Supports both quick flicks and deliberate swipes.
 */
export function useSwipeGesture(options: UseSwipeGestureOptions = {}): SwipeHandlers {
  const { onSwipeLeft, onSwipeRight, enabled = true } = options;

  const stateRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isTracking: false,
  });

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>): void => {
      if (!enabled) return;

      const state = stateRef.current;

      // Ignore if starting from edge zone (iOS back gesture area)
      if (event.clientX < SWIPE_EDGE_ZONE || event.clientX > window.innerWidth - SWIPE_EDGE_ZONE) {
        return;
      }

      state.startX = event.clientX;
      state.startY = event.clientY;
      state.startTime = Date.now();
      state.isTracking = true;
    },
    [enabled]
  );

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>): void => {
    const state = stateRef.current;
    if (!state.isTracking) return;

    // Check if vertical movement exceeds horizontal - cancel swipe tracking
    const deltaX = Math.abs(event.clientX - state.startX);
    const deltaY = Math.abs(event.clientY - state.startY);

    if (deltaY > deltaX && deltaY > SWIPE_THRESHOLD_DISTANCE / 2) {
      state.isTracking = false;
    }
  }, []);

  const handlePointerUp = useCallback(
    (event: PointerEvent<HTMLElement>): void => {
      const state = stateRef.current;
      if (!state.isTracking) return;

      const deltaX = event.clientX - state.startX;
      const deltaTime = Date.now() - state.startTime;
      const velocity = Math.abs(deltaX) / deltaTime;

      // Reset tracking
      state.isTracking = false;

      // Check if swipe meets threshold
      const meetsDistanceThreshold = Math.abs(deltaX) > SWIPE_THRESHOLD_DISTANCE;
      const meetsVelocityThreshold = velocity > SWIPE_THRESHOLD_VELOCITY;

      if (meetsDistanceThreshold || meetsVelocityThreshold) {
        if (deltaX < 0) {
          // Swiped left - forward navigation
          onSwipeLeft?.();
        } else {
          // Swiped right - backward navigation
          onSwipeRight?.();
        }
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  const handlePointerCancel = useCallback((): void => {
    stateRef.current.isTracking = false;
  }, []);

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  };
}

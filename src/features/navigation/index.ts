// Store
export { useJourneyStore } from './store/journeyStore';

// Hooks
export { useNavigation } from './hooks/useNavigation';
export { useSwipeGesture } from './hooks/useSwipeGesture';

// Components
export { DeckNavigator } from './components/DeckNavigator';

// Types
export type {
  JourneyState,
  JourneyActions,
  JourneyStore,
  PageConfig,
  NavigationContext,
  SwipeState,
  TransitionDirection,
} from './types';
export type { DeckNavigatorProps } from './components/DeckNavigator';
export type { UseSwipeGestureOptions, SwipeHandlers } from './hooks/useSwipeGesture';

// Constants
export { TOTAL_STEPS, JOURNEY_STORAGE_KEY } from './constants';

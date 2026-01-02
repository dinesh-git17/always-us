import type { ReactNode } from 'react';
import type { QuoteCategory } from '@lib/quotes';

/** Direction of navigation transition (1 = forward, -1 = backward) */
export type TransitionDirection = 1 | -1;

/** State slice for journey progress tracking */
export interface JourneyState {
  /** Current step index (0-based, 0-13) */
  currentStepIndex: number;
  /** Maximum step the user has reached (for potential future "can't skip ahead" logic) */
  maxStepReached: number;
  /** Whether the journey has been completed */
  isComplete: boolean;
  /** Direction of the last navigation (1 = forward, -1 = backward) */
  direction: TransitionDirection;
}

/** Actions for journey state manipulation */
export interface JourneyActions {
  /** Advance to the next step (if not at end) */
  next: () => void;
  /** Go back to the previous step (if not at start) */
  prev: () => void;
  /** Jump to a specific step index */
  goTo: (index: number) => void;
  /** Mark the journey as complete */
  markComplete: () => void;
  /** Reset journey to initial state */
  reset: () => void;
}

/** Complete journey store type */
export type JourneyStore = JourneyState & JourneyActions;

/** Props for page configuration */
export interface PageConfig {
  /** Unique identifier for the page */
  id: string;
  /** Page title displayed prominently */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Test ID for automated testing */
  testId: string;
  /** Optional page content */
  content?: ReactNode;
  /** Quote category for epigraph display (null = no epigraph) */
  quoteCategory?: QuoteCategory | null;
  /** Delay in seconds before epigraph appears (after page content animation completes) */
  epigraphDelay?: number;
}

/** Navigation context exposed by useNavigation hook */
export interface NavigationContext {
  /** Current step index */
  currentStepIndex: number;
  /** Total number of steps */
  totalSteps: number;
  /** Whether user can navigate forward */
  canGoNext: boolean;
  /** Whether user can navigate backward */
  canGoPrev: boolean;
  /** Whether journey is complete */
  isComplete: boolean;
  /** Direction of the last navigation (1 = forward, -1 = backward) */
  direction: TransitionDirection;
  /** Navigate to next step */
  next: () => void;
  /** Navigate to previous step */
  prev: () => void;
  /** Jump to specific step */
  goTo: (index: number) => void;
}

/** Swipe gesture state */
export interface SwipeState {
  /** Whether a swipe is in progress */
  isSwiping: boolean;
  /** Current horizontal offset during swipe */
  offsetX: number;
  /** Direction of swipe (positive = right/back, negative = left/forward) */
  direction: number;
}

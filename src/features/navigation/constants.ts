/** Total number of steps in the journey */
export const TOTAL_STEPS = 14;

/** Storage key for persisting journey state */
export const JOURNEY_STORAGE_KEY = 'journey-state';

/** Minimum swipe distance in pixels to trigger navigation */
export const SWIPE_THRESHOLD_DISTANCE = 50;

/** Minimum swipe velocity to trigger quick navigation */
export const SWIPE_THRESHOLD_VELOCITY = 0.5;

/** Edge zone width in pixels where swipe is disabled (for iOS back gesture) */
export const SWIPE_EDGE_ZONE = 20;

/**
 * Maximum step index where backward navigation is disabled.
 * Users cannot swipe back from page 1 ("We Chose Each Other") to page 0 (Welcome).
 * This preserves the intro as a one-way entry point while allowing
 * free navigation throughout the rest of the journey.
 */
export const NO_BACK_UNTIL_STEP = 1;

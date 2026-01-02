import type { Easing, Variants } from 'framer-motion';

/**
 * Animation timing configuration interface.
 * Allows different pages to have unique pacing while sharing animation logic.
 */
export interface AnimationConfig {
  /** Initial delay before animations begin (allows page transition to settle) */
  initialDelay: number;
  /** Duration for each element's animation */
  duration: number;
  /** Stagger delay between sequential paragraphs */
  paragraphStagger: number;
  /** Stagger delay between title and subtitle */
  titleSubtitleStagger: number;
  /** Vertical offset for slide-up animation */
  yOffset: number;
  /** Easing curve for the animation (Framer Motion Easing type) */
  ease: Easing;
}

/**
 * Animation timing constants for the "Grounding" entrance sequence.
 * Used on Page 2 to create a settling, intentional feel.
 */
export const GROUNDING_ANIMATION: AnimationConfig = {
  initialDelay: 0.3,
  duration: 0.8,
  paragraphStagger: 0.2,
  titleSubtitleStagger: 0.1,
  yOffset: 20,
  ease: [0.25, 1, 0.5, 1], // easeOutQuart
} as const;

/**
 * Animation timing constants for the "Unfolding" entrance sequence.
 * Used on Page 3 for a softer, more reflective reveal.
 * Slower stagger encourages thoughtful reading.
 */
export const UNFOLDING_ANIMATION: AnimationConfig = {
  initialDelay: 0.2,
  duration: 0.8,
  paragraphStagger: 0.3,
  titleSubtitleStagger: 0.15,
  yOffset: 10,
  ease: [0.33, 1, 0.68, 1], // easeOutCubic
} as const;

/**
 * Easing curve for decelerating animations.
 * Creates smooth, decelerating stop for "settling" effect.
 */
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/**
 * Easing curve for softer, natural animations.
 * Creates a gentle deceleration for "unfolding" effect.
 */
export const EASE_OUT_CUBIC = [0.33, 1, 0.68, 1] as const;

/**
 * Creates text animation variants with configurable timing.
 * Allows different pages to share animation logic with unique pacing.
 *
 * @param config - Animation configuration to use
 * @returns Framer Motion variants object
 */
export function createTextVariants(config: AnimationConfig): Variants {
  return {
    hidden: {
      opacity: 0,
      y: config.yOffset,
    },
    visible: (customDelay: unknown) => {
      // Framer Motion passes custom prop as unknown, ensure we have a valid delay
      const delay = typeof customDelay === 'number' ? customDelay : 0;
      return {
        opacity: 1,
        y: 0,
        transition: {
          delay,
          duration: config.duration,
          ease: config.ease,
        },
      };
    },
  };
}

/**
 * Standard page text animation variants (Grounding style).
 * Text blocks fade in and slide up with staggered timing.
 * Used for Page 2 and similar content-heavy pages.
 */
export const standardTextVariants: Variants = createTextVariants(GROUNDING_ANIMATION);

/**
 * Reflective page text animation variants (Unfolding style).
 * Softer, slower reveal for pages encouraging reflection.
 * Used for Page 3 and similar contemplative pages.
 */
export const reflectiveTextVariants: Variants = createTextVariants(UNFOLDING_ANIMATION);

/**
 * Fade-in variants for UI elements like progress indicators.
 * Simple opacity transition without movement.
 */
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Calculates animation delay for a text element using a given config.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @param config - Animation configuration to use for timing
 * @returns Delay in seconds
 */
export function calculateStaggerDelay(elementIndex: number, config: AnimationConfig): number {
  const { initialDelay, titleSubtitleStagger, paragraphStagger } = config;

  if (elementIndex === 0) {
    // Title
    return initialDelay;
  }

  if (elementIndex === 1) {
    // Subtitle (slight stagger from title)
    return initialDelay + titleSubtitleStagger;
  }

  // Body paragraphs (stagger from previous)
  const bodyIndex = elementIndex - 2;
  return initialDelay + titleSubtitleStagger + paragraphStagger + bodyIndex * paragraphStagger;
}

/**
 * Calculates animation delay for a text element in the grounding sequence.
 * Convenience wrapper using GROUNDING_ANIMATION config.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateGroundingDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, GROUNDING_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the unfolding sequence.
 * Convenience wrapper using UNFOLDING_ANIMATION config.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateUnfoldingDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, UNFOLDING_ANIMATION);
}

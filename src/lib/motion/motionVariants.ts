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
 * Animation timing constants for the "Reassurance" entrance sequence.
 * Used on Page 4 ("Why I Made This") for a calm, settling feel.
 * Minimal vertical movement with soft opacity reveals to convey clarity.
 */
export const REASSURANCE_ANIMATION: AnimationConfig = {
  initialDelay: 0.3,
  duration: 0.8,
  paragraphStagger: 0.25,
  titleSubtitleStagger: 0.1,
  yOffset: 10,
  ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
} as const;

/**
 * Animation timing constants for the "Vow" entrance sequence.
 * Used on Page 6 ("What I Promise You") for deliberate delivery.
 * Significantly slower stagger (0.6s) forces slow reading pace for each promise.
 * Each promise appears as a distinct, thoughtful statement.
 */
export const VOW_ANIMATION: AnimationConfig = {
  initialDelay: 0.3,
  duration: 0.8,
  paragraphStagger: 0.6,
  titleSubtitleStagger: 0.1,
  yOffset: 10,
  ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
} as const;

/**
 * Animation timing constants for the "Everyday" entrance sequence.
 * Used on Page 7 ("How I Show Up Every Day") for fluid, continuous flow.
 * Faster stagger (0.25s) with smooth easing suggests natural, frequent actions.
 * Content flows in like a gentle stream rather than distinct, heavy statements.
 */
export const EVERYDAY_ANIMATION: AnimationConfig = {
  initialDelay: 0.2,
  duration: 0.6,
  paragraphStagger: 0.25,
  titleSubtitleStagger: 0.1,
  yOffset: 10,
  ease: [0.39, 0.575, 0.565, 1], // easeOutSine
} as const;

/**
 * Animation timing constants for the "Anchor" entrance sequence.
 * Used on Page 8 ("On the Hard Days") for grounding, protective feel.
 * Slower stagger (0.5s) and longer duration create weight and stability.
 * Content settles like an anchor, conveying "I am not going anywhere."
 */
export const ANCHOR_ANIMATION: AnimationConfig = {
  initialDelay: 0.3,
  duration: 0.8,
  paragraphStagger: 0.5,
  titleSubtitleStagger: 0.1,
  yOffset: 10,
  ease: [0.33, 1, 0.68, 1], // easeOutCubic
} as const;

/**
 * Animation timing constants for the "Foundation" entrance sequence.
 * Used on Page 8 ("Trust and Loyalty") for steady, unwavering presence.
 * Medium stagger (0.4s) conveys composure and confidence.
 * Lower Y offset (8px) minimizes flux, suggesting immovable stability.
 */
export const FOUNDATION_ANIMATION: AnimationConfig = {
  initialDelay: 0.3,
  duration: 0.8,
  paragraphStagger: 0.4,
  titleSubtitleStagger: 0.1,
  yOffset: 8,
  ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
} as const;

/**
 * Animation timing constants for the "Horizon" entrance sequence.
 * Used on Page 9 ("What We're Building Together") for optimistic forward motion.
 * Faster stagger (0.3s) implies momentum and natural growth.
 * Moderate Y offset (12px) creates gentle "lifting" effect suggesting hope.
 */
export const HORIZON_ANIMATION: AnimationConfig = {
  initialDelay: 0.3,
  duration: 0.8,
  paragraphStagger: 0.3,
  titleSubtitleStagger: 0.1,
  yOffset: 12,
  ease: [0.33, 1, 0.68, 1], // easeOutCubic
} as const;

/**
 * Animation timing constants for the "Smile" entrance sequence.
 * Used on Page 10 ("The Non-Refundable Clause") for playful, crisp certainty.
 * Fast stagger (0.2s) creates conversational pace. Shorter duration (0.6s) feels decisive.
 * The final "closer" element receives an additional delay for comedic/emotional timing.
 */
export const SMILE_ANIMATION: AnimationConfig = {
  initialDelay: 0.2,
  duration: 0.6,
  paragraphStagger: 0.2,
  titleSubtitleStagger: 0.1,
  yOffset: 10,
  ease: [0.22, 1, 0.36, 1], // easeOutQuint - decisive, snappy
} as const;

/** Additional delay added before the "closer" element in Smile animation */
export const SMILE_CLOSER_EXTRA_DELAY = 0.4;

/**
 * Animation timing constants for the "Ceremonial" entrance sequence.
 * Used on Page 12 ("Signatures & Sealing") for a reverent, high-damping feel.
 * Long durations and slow staggers suppress visual momentum, creating stillness.
 * The final element receives additional delay to isolate the closing instruction.
 */
export const CEREMONIAL_ANIMATION: AnimationConfig = {
  initialDelay: 0.5,
  duration: 1.2,
  paragraphStagger: 0.8,
  titleSubtitleStagger: 0.15,
  yOffset: 8,
  ease: [0.37, 0, 0.63, 1], // easeInOutSine - very soft, no snap
} as const;

/** Additional delay added before the final "pause" element in Ceremonial animation */
export const CEREMONIAL_PAUSE_EXTRA_DELAY = 1.0;

/**
 * Animation timing constants for the "Timeless" entrance sequence.
 * Used on Page 13 ("Eternal Validity") for a gentle, enduring feel.
 * Extended durations and soft easing create a sense of drift and permanence.
 * Content feels like it "simply exists" rather than arriving with momentum.
 */
export const TIMELESS_ANIMATION: AnimationConfig = {
  initialDelay: 0.4,
  duration: 1.2,
  paragraphStagger: 0.7,
  titleSubtitleStagger: 0.15,
  yOffset: 5,
  ease: [0.46, 0.03, 0.52, 0.96], // easeInOutQuad - soft start, soft end
} as const;

/**
 * Animation timing constants for the "Finale" entrance sequence.
 * Used on Page 14 ("Final Words") for the emotional conclusion.
 * The slowest animation in the app, forcing deliberate, meditative reading.
 * Extended duration and slow stagger create a "final exhale" feeling.
 */
export const FINALE_ANIMATION: AnimationConfig = {
  initialDelay: 0.5,
  duration: 1.5,
  paragraphStagger: 0.8,
  titleSubtitleStagger: 0.15,
  yOffset: 5,
  ease: [0.37, 0, 0.63, 1], // easeInOutSine - no impact, just presence
} as const;

/** Additional delay added before the "signature" element in Finale animation */
export const FINALE_SIGNATURE_EXTRA_DELAY = 1.5;

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
 * Reassurance page text animation variants (Settling style).
 * Calm, grounded reveal for pages conveying intent and care.
 * Used for Page 4 ("Why I Made This") and similar reassuring pages.
 */
export const reassuranceTextVariants: Variants = createTextVariants(REASSURANCE_ANIMATION);

/**
 * Vow page text animation variants (Deliberate delivery style).
 * Significantly slower reveal for promise-based content.
 * Used for Page 6 ("What I Promise You") to give each vow its own moment.
 */
export const vowTextVariants: Variants = createTextVariants(VOW_ANIMATION);

/**
 * Everyday page text animation variants (Continuous flow style).
 * Faster, fluid reveal for content about daily presence.
 * Used for Page 7 ("How I Show Up Every Day") to suggest natural, ongoing care.
 */
export const everydayTextVariants: Variants = createTextVariants(EVERYDAY_ANIMATION);

/**
 * Anchor page text animation variants (Grounding, protective style).
 * Slower, heavier reveal for emotionally weighted content.
 * Used for Page 8 ("On the Hard Days") to convey stability and safety.
 */
export const anchorTextVariants: Variants = createTextVariants(ANCHOR_ANIMATION);

/**
 * Foundation page text animation variants (Steady, unwavering style).
 * Crisp fade with minimal movement for content about trust and loyalty.
 * Used for Page 8 ("Trust and Loyalty") to convey certainty and permanence.
 */
export const foundationTextVariants: Variants = createTextVariants(FOUNDATION_ANIMATION);

/**
 * Horizon page text animation variants (Optimistic, forward-looking style).
 * Gentle lift with fluid timing for content about building the future.
 * Used for Page 9 ("What We're Building Together") to convey hope and growth.
 */
export const horizonTextVariants: Variants = createTextVariants(HORIZON_ANIMATION);

/**
 * Smile page text animation variants (Playful, decisive style).
 * Crisp fade with snappy timing for lighthearted commitment content.
 * Used for Page 10 ("The Non-Refundable Clause") to convey playful certainty.
 */
export const smileTextVariants: Variants = createTextVariants(SMILE_ANIMATION);

/**
 * Ceremonial page text animation variants (Reverent, high-damping style).
 * Very slow fade with minimal movement to create stillness and gravity.
 * Used for Page 12 ("Signatures & Sealing") to force a contemplative pause.
 */
export const ceremonialTextVariants: Variants = createTextVariants(CEREMONIAL_ANIMATION);

/**
 * Timeless page text animation variants (Enduring, gentle drift style).
 * Extended fade with barely perceptible movement to create permanence.
 * Used for Page 13 ("Eternal Validity") to convey "forever" as a state of rest.
 */
export const timelessTextVariants: Variants = createTextVariants(TIMELESS_ANIMATION);

/**
 * Finale page text animation variants (Final exhale style).
 * The slowest animation in the app with extended 1.5s fade duration.
 * Used for Page 14 ("Final Words") as the emotional conclusion.
 */
export const finaleTextVariants: Variants = createTextVariants(FINALE_ANIMATION);

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

/**
 * Calculates animation delay for a text element in the reassurance sequence.
 * Convenience wrapper using REASSURANCE_ANIMATION config.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateReassuranceDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, REASSURANCE_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the vow sequence.
 * Convenience wrapper using VOW_ANIMATION config.
 * Slower stagger creates deliberate pacing for promise delivery.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateVowDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, VOW_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the everyday sequence.
 * Convenience wrapper using EVERYDAY_ANIMATION config.
 * Faster stagger creates fluid, continuous flow for daily presence content.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateEverydayDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, EVERYDAY_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the anchor sequence.
 * Convenience wrapper using ANCHOR_ANIMATION config.
 * Slower stagger creates grounding, protective feel for emotionally heavy content.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateAnchorDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, ANCHOR_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the foundation sequence.
 * Convenience wrapper using FOUNDATION_ANIMATION config.
 * Steady stagger conveys composure and certainty for trust-based content.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateFoundationDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, FOUNDATION_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the horizon sequence.
 * Convenience wrapper using HORIZON_ANIMATION config.
 * Fluid stagger conveys optimism and forward momentum for future-focused content.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateHorizonDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, HORIZON_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the smile sequence.
 * Convenience wrapper using SMILE_ANIMATION config.
 * Fast stagger creates conversational, playful pace for lighthearted content.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateSmileDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, SMILE_ANIMATION);
}

/**
 * Calculates animation delay for the "closer" element in the smile sequence.
 * Adds an extra pause before the final punchline for comedic/emotional timing.
 * Creates the "beat" that allows the previous content to land before the closer appears.
 *
 * @param elementIndex - Zero-based index of the closer element
 * @returns Delay in seconds (includes SMILE_CLOSER_EXTRA_DELAY)
 */
export function calculateSmileCloserDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, SMILE_ANIMATION) + SMILE_CLOSER_EXTRA_DELAY;
}

/**
 * Calculates animation delay for a text element in the ceremonial sequence.
 * Convenience wrapper using CEREMONIAL_ANIMATION config.
 * Very slow stagger creates reverent, contemplative pacing for sealing content.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateCeremonialDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, CEREMONIAL_ANIMATION);
}

/**
 * Calculates animation delay for the final "pause" element in the ceremonial sequence.
 * Adds significant extra delay to isolate the closing instruction ("Take a breath here").
 * Creates a moment of stillness before the final message appears.
 *
 * @param elementIndex - Zero-based index of the pause element
 * @returns Delay in seconds (includes CEREMONIAL_PAUSE_EXTRA_DELAY)
 */
export function calculateCeremonialPauseDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, CEREMONIAL_ANIMATION) + CEREMONIAL_PAUSE_EXTRA_DELAY;
}

/**
 * Calculates animation delay for a text element in the timeless sequence.
 * Convenience wrapper using TIMELESS_ANIMATION config.
 * Slow stagger creates enduring, unhurried pacing for permanence content.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateTimelessDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, TIMELESS_ANIMATION);
}

/**
 * Calculates animation delay for a text element in the finale sequence.
 * Convenience wrapper using FINALE_ANIMATION config.
 * The slowest stagger in the app creates meditative pacing for the conclusion.
 *
 * @param elementIndex - Zero-based index of the element (0 = title, 1 = subtitle, 2+ = body paragraphs)
 * @returns Delay in seconds
 */
export function calculateFinaleDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, FINALE_ANIMATION);
}

/**
 * Calculates animation delay for the "signature" element in the finale sequence.
 * Adds significant extra delay to create a moment of silence before "Always us."
 * The final thought appears after a deliberate pause, emphasizing finality.
 *
 * @param elementIndex - Zero-based index of the signature element
 * @returns Delay in seconds (includes FINALE_SIGNATURE_EXTRA_DELAY)
 */
export function calculateFinaleSignatureDelay(elementIndex: number): number {
  return calculateStaggerDelay(elementIndex, FINALE_ANIMATION) + FINALE_SIGNATURE_EXTRA_DELAY;
}

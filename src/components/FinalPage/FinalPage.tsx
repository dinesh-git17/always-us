import { type ReactNode, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
  finaleTextVariants,
  breathingVariants,
  calculateFinaleDelay,
  calculateFinaleSignatureDelay,
  FINALE_ANIMATION,
} from '@lib/motion';

import styles from './FinalPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'Final Words';
const SUBTITLE = 'Where love is spoken, and meant.';

/** Body paragraphs 1-4: finale stagger timing */
const BODY_PARAGRAPHS = [
  'If you take nothing else from this, take this.',
  'I chose these words carefully because I chose you carefully. Not just in moments of closeness, but in intention, in presence, and in heart.',
  'I love you. Not lightly, and not temporarily, but with care and certainty.',
  'This is my promise to you: to keep choosing you, to keep loving you, and to keep building us, every day.',
] as const;

/** The signature: receives extra delay for final moment of silence */
const SIGNATURE = 'Always us.';

export interface FinalPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/** Duration buffer for breathing animation to start after entrance completes */
const BREATHING_START_BUFFER = 0.5;

/**
 * Page 14: "Final Words"
 *
 * The emotional conclusion of the journey, leaving a lasting impression of safety.
 * Uses the Finale animation sequence - the slowest in the app - with 0.8s stagger
 * and 1.5s fade duration for deliberate, meditative pacing.
 * The signature "Always us." appears after an extra 1.5s delay, creating a moment
 * of silence before the final thought is spoken.
 * After entrance animation completes, signature text begins subtle breathing animation
 * to signal the app is alive and holding space for the user.
 * Respects prefers-reduced-motion for accessibility.
 */
export function FinalPage({ testId = 'page-13' }: FinalPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [isBreathing, setIsBreathing] = useState(false);

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  // Index for the signature element (after title, subtitle, and 4 body paragraphs)
  const signatureIndex = 6;

  // Calculate when breathing should start (after signature animation completes)
  const signatureDelay = calculateFinaleSignatureDelay(signatureIndex);
  const breathingStartTime =
    (signatureDelay + FINALE_ANIMATION.duration + BREATHING_START_BUFFER) * 1000;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      setIsBreathing(true);
    }, breathingStartTime);

    return (): void => {
      clearTimeout(timer);
    };
  }, [breathingStartTime, prefersReducedMotion]);

  return (
    <article className={styles.page} data-testid={testId} data-scrollable aria-label="Final Words">
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={finaleTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateFinaleDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={finaleTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateFinaleDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {/* Body paragraphs 1-4: finale stagger */}
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={finaleTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateFinaleDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}

          {/* The signature: extra delay for final moment of silence, then breathing */}
          <motion.p
            className={styles.signature}
            variants={isBreathing ? breathingVariants : finaleTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={isBreathing ? 'breathing' : animationState}
            custom={calculateFinaleSignatureDelay(signatureIndex)}
          >
            {SIGNATURE}
          </motion.p>
        </div>
      </div>
    </article>
  );
}

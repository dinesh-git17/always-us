import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ceremonialTextVariants,
  calculateCeremonialDelay,
  calculateCeremonialPauseDelay,
} from '@lib/motion';

import styles from './SignaturesPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'Signatures & Sealing';
const SUBTITLE = 'A moment held with intention.';

/** Body paragraphs 1-3: standard ceremonial stagger timing */
const BODY_PARAGRAPHS = [
  "This is where what we've shared is gently sealed. Not with ink or formality, but with meaning.",
  'Everything before this was written with care. Everything after this is carried with intention.',
  'This moment belongs to us. A quiet acknowledgment of what we choose, and what we protect.',
] as const;

/** The pause: receives extra delay to create contemplative moment */
const PAUSE = 'Take a breath here. This matters.';

export interface SignaturesPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 12: "Signatures & Sealing"
 *
 * A ceremonial threshold page marking the transition from narrative to finalization.
 * Uses the Ceremonial animation sequence with very slow 0.8s stagger for reverent pacing.
 * The final "pause" paragraph receives an extra 1.0s delay to create stillness
 * and encourage the user to slow down before the experience concludes.
 * Respects prefers-reduced-motion for accessibility.
 */
export function SignaturesPage({ testId = 'page-11' }: SignaturesPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  // Index for the pause element (after title, subtitle, and 3 body paragraphs)
  const pauseIndex = 5;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="Signatures and Sealing"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={ceremonialTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateCeremonialDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={ceremonialTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateCeremonialDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {/* Body paragraphs 1-3: ceremonial stagger */}
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={ceremonialTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateCeremonialDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}

          {/* The pause: extra delay for contemplative moment */}
          <motion.p
            className={styles.pause}
            variants={ceremonialTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateCeremonialPauseDelay(pauseIndex)}
          >
            {PAUSE}
          </motion.p>
        </div>
      </div>
    </article>
  );
}

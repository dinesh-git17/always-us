import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { smileTextVariants, calculateSmileDelay, calculateSmileCloserDelay } from '@lib/motion';

import styles from './NonRefundablePage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'The Non-Refundable Clause';
const SUBTITLE = 'Chosen with intention. Kept with care.';

/** Body paragraphs 1-3: standard stagger timing */
const BODY_PARAGRAPHS = [
  'Just a small note, written with a smile.',
  'What we have was not chosen lightly, and it is not something I plan to return, exchange, or reconsider. Once you have my heart, it is yours to keep.',
  'No fine print. No hidden conditions. Just a choice made clearly, and held with certainty.',
] as const;

/** The closer: receives extra delay for emotional/comedic "beat" */
const CLOSER = 'This one is simple. You are my favorite decision.';

export interface NonRefundablePageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 10: "The Non-Refundable Clause"
 *
 * A playful tonal shift using legalistic language in a romantic context.
 * Uses the Smile animation sequence with fast 0.2s stagger for conversational pace.
 * The final "closer" paragraph receives an extra 0.4s delay to create a "beat"
 * that allows the punchline to land effectively.
 * Respects prefers-reduced-motion for accessibility.
 */
export function NonRefundablePage({ testId = 'page-10' }: NonRefundablePageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  // Index for the closer (after title, subtitle, and 3 body paragraphs)
  const closerIndex = 5;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="The Non-Refundable Clause"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={smileTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateSmileDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={smileTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateSmileDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {/* Body paragraphs 1-3: standard stagger */}
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={smileTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateSmileDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}

          {/* The closer: extra delay for the "beat" */}
          <motion.p
            className={styles.closer}
            variants={smileTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateSmileCloserDelay(closerIndex)}
          >
            {CLOSER}
          </motion.p>
        </div>
      </div>
    </article>
  );
}

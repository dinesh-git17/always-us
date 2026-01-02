import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { timelessTextVariants, calculateTimelessDelay } from '@lib/motion';

import styles from './EternalValidityPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'Eternal Validity';
const SUBTITLE = 'Without expiration. Without conditions.';

/** Body paragraphs: timeless stagger timing */
const BODY_PARAGRAPHS = [
  'What we have is not meant to fade with time. It is held with care, and carried forward with intention.',
  'This commitment does not come with an end date. It is not something we revisit or reconsider. It simply exists, steady and present.',
  'I choose you, today and always. Not just for now, but forever.',
  'This is us, moving forward with love that does not expire.',
] as const;

export interface EternalValidityPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 13: "Eternal Validity"
 *
 * The emotional anchor for permanence, communicating "forever" as a state of rest.
 * Uses the Timeless animation sequence with slow 0.7s stagger for enduring pacing.
 * Extended 1.2s fade duration with barely perceptible 5px drift creates a sense
 * that the content "simply exists" rather than arriving with momentum.
 * Respects prefers-reduced-motion for accessibility.
 */
export function EternalValidityPage({ testId = 'page-12' }: EternalValidityPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="Eternal Validity"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={timelessTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateTimelessDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={timelessTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateTimelessDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={timelessTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateTimelessDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

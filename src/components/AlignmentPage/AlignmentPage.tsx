import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { reassuranceTextVariants, calculateReassuranceDelay } from '@lib/motion';

import styles from './AlignmentPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'What This Means to Us';
const SUBTITLE = 'A shared understanding, held with care.';

const BODY_PARAGRAPHS = [
  'What this means to us is simple and steady. We choose to show up for each other with honesty, patience, and respect.',
  'We are not here to rush love or force it into shape. We are here to let it grow naturally, supported by trust and intention.',
  'This is about knowing where we stand. About feeling secure in what we share. About moving forward together, without uncertainty.',
  'This is us, choosing clarity and care, side by side.',
] as const;

export interface AlignmentPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 5: "What This Means to Us"
 *
 * Alignment page that establishes a shared understanding of the relationship.
 * Uses the standard "Reassurance" animation for consistent pacing across pages.
 * Respects prefers-reduced-motion for accessibility.
 */
export function AlignmentPage({ testId = 'page-4' }: AlignmentPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="What This Means to Us"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={reassuranceTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateReassuranceDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={reassuranceTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateReassuranceDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={reassuranceTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateReassuranceDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

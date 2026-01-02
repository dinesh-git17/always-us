import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { vowTextVariants, calculateVowDelay } from '@lib/motion';

import styles from './PromisesPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'What I Promise You';
const SUBTITLE = 'Spoken with care, and meant deeply.';

const BODY_PARAGRAPHS = [
  'I promise to choose you with intention, even on days that feel quiet or uncertain.',
  'I promise to listen with an open heart, and to make space for your thoughts and feelings.',
  'I promise to be honest with you, always, even when it is not easy.',
  'I promise to treat your heart gently, with patience, respect, and care.',
  'I promise to show up with love, not just in words, but in the way I am with you.',
] as const;

export interface PromisesPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 6: "What I Promise You"
 *
 * Presents five personal vows with deliberate, slow animation pacing.
 * Each promise appears one by one with a 0.6s stagger to encourage
 * thoughtful reading and prevent a "wall of text" effect.
 * Respects prefers-reduced-motion for accessibility.
 */
export function PromisesPage({ testId = 'page-5' }: PromisesPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="What I Promise You"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={vowTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateVowDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={vowTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateVowDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={vowTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateVowDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { reflectiveTextVariants, calculateUnfoldingDelay } from '@lib/motion';

import styles from './BeginningPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'Where It All Began';
const SUBTITLE = 'The start of something real.';

const BODY_PARAGRAPHS = [
  'What we found did not arrive all at once. It unfolded naturally, through moments that felt easy and conversations that mattered.',
  'We learned each other slowly. We listened, we opened up, and we let trust grow without forcing it.',
  'Somewhere along the way, without needing to name it, we realized this was becoming something worth holding onto.',
  'That is where it began.',
] as const;

export interface BeginningPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 3: "Where It All Began"
 *
 * Reflective grounding page that acknowledges the relationship's history.
 * Uses the "Unfolding" animation with slower stagger for contemplative pacing.
 * Respects prefers-reduced-motion for accessibility.
 */
export function BeginningPage({ testId = 'page-2' }: BeginningPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="Where It All Began"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={reflectiveTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateUnfoldingDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={reflectiveTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateUnfoldingDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={reflectiveTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateUnfoldingDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

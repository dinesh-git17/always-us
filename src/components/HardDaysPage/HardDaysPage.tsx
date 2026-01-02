import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { anchorTextVariants, calculateAnchorDelay } from '@lib/motion';

import styles from './HardDaysPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'On the Hard Days';
const SUBTITLE = 'When things feel heavy, you are not alone.';

const BODY_PARAGRAPHS = [
  'On the hard days, I stay. Not to fix you, and not to rush you through what you feel.',
  'I stay to listen, to understand, and to remind you that your feelings are safe with me.',
  'I will be patient when things are quiet, and gentle when words are hard to find. I will hold space for you without asking you to be anything other than yourself.',
  'No matter what a day looks like, you will never have to face it alone. I am here, steady and present, even when things feel heavy.',
] as const;

export interface HardDaysPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 8: "On the Hard Days"
 *
 * Presents four statements about emotional safety with grounding, anchor-like animation.
 * Uses slower 0.5s stagger with easeOutCubic to create a "settling" effect,
 * conveying stability and the promise "I am not going anywhere."
 * Respects prefers-reduced-motion for accessibility.
 */
export function HardDaysPage({ testId = 'page-7' }: HardDaysPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="On the Hard Days"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={anchorTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateAnchorDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={anchorTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateAnchorDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={anchorTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateAnchorDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

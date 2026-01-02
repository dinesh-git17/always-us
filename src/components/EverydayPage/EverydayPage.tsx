import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { everydayTextVariants, calculateEverydayDelay } from '@lib/motion';

import styles from './EverydayPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'How I Show Up Every Day';
const SUBTITLE = 'In the small moments that matter most.';

const BODY_PARAGRAPHS = [
  'I show up with presence, giving you my attention when you need it most.',
  'I show up with patience, understanding that feelings take time and space.',
  'I show up with kindness, even in moments that are ordinary or quiet.',
  'I show up with honesty, choosing openness and clarity every day.',
  'I show up with care, holding your heart gently and thoughtfully.',
  'I show up with love, steady and real, in ways you can feel.',
] as const;

export interface EverydayPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 7: "How I Show Up Every Day"
 *
 * Presents six statements about daily presence with fluid, continuous animation.
 * Uses faster 0.25s stagger with easeOutSine to create a "gentle stream" effect,
 * distinct from the slower, deliberate pacing of the Promises page.
 * Respects prefers-reduced-motion for accessibility.
 */
export function EverydayPage({ testId = 'page-6' }: EverydayPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="How I Show Up Every Day"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={everydayTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateEverydayDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={everydayTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateEverydayDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={everydayTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateEverydayDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

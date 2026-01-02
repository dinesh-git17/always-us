import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { horizonTextVariants, calculateHorizonDelay } from '@lib/motion';

import styles from './BuildingPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = "What We're Building Together";
const SUBTITLE = 'A future shaped with intention and care.';

const BODY_PARAGRAPHS = [
  'What we are building together is not rushed or imagined. It is something steady, formed through trust, patience, and shared moments.',
  'It is a future that grows naturally, shaped by who we are and how we choose each other. One where love is nurtured, communication stays open, and we move forward side by side.',
  'There is no need to have everything figured out. What matters is that we are building with honesty, with care, and with love that feels real.',
  'This is not about where we end up. It is about how we walk forward together.',
] as const;

export interface BuildingPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 9: "What We're Building Together"
 *
 * Presents a forward-looking vision of the relationship with optimistic motion.
 * Uses the Horizon animation sequence with 0.3s stagger and 12px Y offset
 * to create a gentle "lifting" effect. The animation conveys hope and natural growth,
 * feeling lighter than the grounding of previous pages.
 * Respects prefers-reduced-motion for accessibility.
 */
export function BuildingPage({ testId = 'page-9' }: BuildingPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="What We're Building Together"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={horizonTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateHorizonDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={horizonTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateHorizonDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={horizonTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateHorizonDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { foundationTextVariants, calculateFoundationDelay } from '@lib/motion';

import styles from './TrustPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'Trust and Loyalty';
const SUBTITLE = 'So you never have to question where you stand.';

const BODY_PARAGRAPHS = [
  'Trust matters to me deeply, and I protect it with care. You will never have to wonder about my intentions or my heart.',
  'I choose honesty in how I show up with you, and loyalty in how I hold what we share. Not loudly, and not for display, but quietly and consistently.',
  'I want you to feel secure in us. To know that what we have is respected, protected, and never taken lightly.',
  'With me, there is clarity. There is steadiness. And there is a place where your heart can rest.',
] as const;

export interface TrustPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 8: "Trust and Loyalty"
 *
 * Establishes the foundational pillars of relationship security (Trust, Loyalty, Honesty).
 * Uses the Foundation animation sequence with 0.4s stagger and minimal Y offset (8px)
 * to create a steady, unwavering presence. The animation conveys certainty and permanence,
 * as if promises are being etched in stone rather than spoken in passing.
 * Respects prefers-reduced-motion for accessibility.
 */
export function TrustPage({ testId = 'page-8' }: TrustPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="Trust and Loyalty"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={foundationTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateFoundationDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={foundationTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateFoundationDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={foundationTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateFoundationDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

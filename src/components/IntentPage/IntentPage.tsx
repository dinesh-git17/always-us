import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { reassuranceTextVariants, calculateReassuranceDelay } from '@lib/motion';

import styles from './IntentPage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'Why I Made This';
const SUBTITLE = 'Because what we have deserves intention.';

const BODY_PARAGRAPHS = [
  'I made this because what we share matters to me. Not in a loud way, and not to make a statement. But because love like this deserves to be treated with care.',
  'I wanted to create something that slows us down. Something that feels thoughtful, honest, and real. A place where feelings are clear and never rushed.',
  'This is not about expectations or rules. It is simply about choosing to show up with intention, and letting love be something we handle gently.',
] as const;

export interface IntentPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 4: "Why I Made This"
 *
 * Critical emotional pivot point that frames the app as an act of care.
 * Uses the "Reassurance" animation with calm, settled motion to convey
 * clarity and reduce anxiety about expectations.
 * Respects prefers-reduced-motion for accessibility.
 */
export function IntentPage({ testId = 'page-3' }: IntentPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="Why I Made This"
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

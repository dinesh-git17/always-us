import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { timelessTextVariants, calculateTimelessDelay } from '@lib/motion';

import styles from './WheneverPage.module.css';

/** Page content - the bridge between formal declarations and intimate close */
const TITLE = 'Whenever You Need This';

const BODY_PARAGRAPHS = [
  "This isn't a one-time thing.",
  "This was never meant to be opened once and set aside. It's here for the quiet moments, the heavy days, and the times you just want to feel close.",
  'You can come back whenever you need reassurance, comfort, or a reminder of us. Nothing changes when you close it. Nothing fades when time passes.',
  "I'm still here.",
  'And this will always be waiting for you.',
] as const;

export interface WheneverPageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 15: "Whenever You Need This"
 *
 * The transitional page between formal declarations and intimate close.
 * Reframes the app from a one-time document to a lasting presence.
 * Uses the Timeless animation for gentle, enduring pacing.
 * Respects prefers-reduced-motion for accessibility.
 */
export function WheneverPage({ testId = 'page-14' }: WheneverPageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  const shouldAnimate = !prefersReducedMotion;
  const animationState = 'visible';

  return (
    <article className={styles.page} data-testid={testId} data-scrollable aria-label={TITLE}>
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
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={timelessTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateTimelessDelay(index + 1)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

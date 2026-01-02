import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { standardTextVariants, calculateGroundingDelay } from '@lib/motion';

import styles from './ChoicePage.module.css';

/** Page content - immutable as per story requirements */
const TITLE = 'We Chose Each Other';
const SUBTITLE = 'Not by chance, but with intention.';

const BODY_PARAGRAPHS = [
  'What we have did not happen accidentally. It grew because we both showed up, again and again.',
  'Out of all the moments, all the paths, and all the possibilities, we chose each other.',
  'Not perfectly. Not effortlessly. But honestly, and with care.',
  'That choice was made quietly and meant deeply. And it is what makes this worth continuing.',
] as const;

export interface ChoicePageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 2: "We Chose Each Other"
 *
 * Marks the beginning of the structured narrative with the "Grounding" animation.
 * Text settles into place to reinforce the concept of intentional choice.
 * Respects prefers-reduced-motion for accessibility.
 */
export function ChoicePage({ testId = 'page-1' }: ChoicePageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if user prefers reduced motion
  const animationState = prefersReducedMotion ? 'visible' : 'visible';
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="We Chose Each Other"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            variants={standardTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateGroundingDelay(0)}
          >
            {TITLE}
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={standardTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate={animationState}
            custom={calculateGroundingDelay(1)}
          >
            {SUBTITLE}
          </motion.p>
        </header>

        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph.slice(0, 20)}
              className={styles.body}
              variants={standardTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'}
              animate={animationState}
              custom={calculateGroundingDelay(index + 2)}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}

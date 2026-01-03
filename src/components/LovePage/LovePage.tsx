import { type ReactNode, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { breathingVariants, FINALE_ANIMATION } from '@lib/motion';

import styles from './LovePage.module.css';

/** The simple, intimate close - just these words */
const DECLARATION = 'I love you, Carolina.';

/** Initial delay before the declaration appears */
const ENTRANCE_DELAY = 0.6;

/** Duration of the fade-in entrance */
const ENTRANCE_DURATION = 2.0;

/** Buffer before breathing animation starts */
const BREATHING_START_BUFFER = 0.5;

export interface LovePageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Page 16: "I love you, Carolina."
 *
 * The final destination of the journey. After all the formal declarations,
 * the architecture falls away and you're just two people.
 * A single phrase, centered, breathing. Nothing else.
 *
 * Uses a slow fade-in entrance, then transitions to subtle breathing animation
 * to signal the app is alive and holding space.
 *
 * The progress bar and navigation controls are hidden on this page
 * to create visual intimacy and signal arrival.
 *
 * Respects prefers-reduced-motion for accessibility.
 */
export function LovePage({ testId = 'page-15' }: LovePageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [isBreathing, setIsBreathing] = useState(false);

  const shouldAnimate = !prefersReducedMotion;

  // Calculate when breathing should start (after entrance animation completes)
  const breathingStartTime = (ENTRANCE_DELAY + ENTRANCE_DURATION + BREATHING_START_BUFFER) * 1000;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => {
      setIsBreathing(true);
    }, breathingStartTime);

    return (): void => {
      clearTimeout(timer);
    };
  }, [breathingStartTime, prefersReducedMotion]);

  // Custom entrance variants for the declaration
  const entranceVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: ENTRANCE_DELAY,
        duration: ENTRANCE_DURATION,
        ease: FINALE_ANIMATION.ease,
      },
    },
  };

  return (
    <article className={styles.page} data-testid={testId} aria-label="I love you">
      <div className={styles.container}>
        <motion.p
          className={styles.declaration}
          variants={isBreathing ? breathingVariants : entranceVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate={isBreathing ? 'breathing' : 'visible'}
        >
          {DECLARATION}
        </motion.p>
      </div>
    </article>
  );
}

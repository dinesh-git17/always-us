import { type ReactNode, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { EASE_IN_OUT_SINE } from '@lib/motion';
import { useRitualStore } from '../../store/ritualStore';
import { NAME_RECOGNITION_DELAY_MS } from '../../constants';

import styles from './NameRecognition.module.css';

export interface NameRecognitionProps {
  testId?: string;
}

/** Greeting animation: fade in with gentle rise */
const greetingVariants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: EASE_IN_OUT_SINE,
    },
  },
};

/** Breathing animation: subtle pulse after entrance */
const breathingVariants = {
  initial: {
    opacity: 1,
  },
  breathing: {
    opacity: [1, 0.85, 1],
    transition: {
      duration: 3.5,
      ease: 'easeInOut' as const,
      repeat: Infinity,
      repeatType: 'loop' as const,
    },
  },
};

/**
 * Shows the personalized greeting after name capture.
 * Displays "Hi, {name}." with a gentle fade-in and breathing effect.
 */
export function NameRecognition({ testId = 'name-recognition' }: NameRecognitionProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const userName = useRitualStore((state) => state.userName);
  const setStep = useRitualStore((state) => state.setStep);

  // Transition to passcode setup after greeting breathes
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('passcode_create');
    }, NAME_RECOGNITION_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [setStep]);

  return (
    <motion.article
      className={styles.container}
      data-testid={testId}
      aria-label="Greeting"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_IN_OUT_SINE } }}
    >
      <motion.div
        className={styles.greeting}
        variants={greetingVariants}
        initial={shouldAnimate ? 'hidden' : 'visible'}
        animate="visible"
      >
        <motion.h1
          className={styles.greetingText}
          variants={shouldAnimate ? breathingVariants : undefined}
          initial="initial"
          animate="breathing"
        >
          Hi, {userName}.
        </motion.h1>
      </motion.div>
    </motion.article>
  );
}

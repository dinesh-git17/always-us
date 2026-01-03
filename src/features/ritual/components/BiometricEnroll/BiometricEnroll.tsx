import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ceremonialTextVariants,
  calculateCeremonialDelay,
  ritualExitVariants,
  EASE_IN_OUT_SINE,
} from '@lib/motion';
import { useRitualStore } from '../../store/ritualStore';
import { useBiometric } from '../../hooks/useBiometric';

import styles from './BiometricEnroll.module.css';

const PROMPT = 'Shall I recognize you next time?';
const SUBTITLE = 'You can always use your key instead.';

export interface BiometricEnrollProps {
  testId?: string;
}

/**
 * Face ID enrollment step.
 * Offers to enable biometric authentication for future entries.
 * Skippable - user can always use passcode instead.
 */
export function BiometricEnroll({ testId = 'biometric-enroll' }: BiometricEnrollProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const setBiometricEnabled = useRitualStore((state) => state.setBiometricEnabled);
  const completeOnboarding = useRitualStore((state) => state.completeOnboarding);

  const { isAvailable, authenticate } = useBiometric();

  // Handle "Yes, please" - enable Face ID
  const handleEnableBiometric = async (): Promise<void> => {
    if (isAvailable) {
      const success = await authenticate();
      setBiometricEnabled(success);
    } else {
      // Biometric not available - skip silently
      setBiometricEnabled(false);
    }
    completeOnboarding();
  };

  // Handle "No, I'll use the key" - skip Face ID
  const handleSkipBiometric = (): void => {
    setBiometricEnabled(false);
    completeOnboarding();
  };

  return (
    <motion.article
      className={styles.container}
      data-testid={testId}
      aria-label="Face ID enrollment"
      variants={ritualExitVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.content}>
        {/* Icon */}
        <motion.div
          className={styles.iconContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_IN_OUT_SINE }}
          aria-hidden="true"
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Face outline */}
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
            {/* Eyes */}
            <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
            {/* Smile */}
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          </svg>
        </motion.div>

        {/* Prompt */}
        <motion.h1
          className={styles.prompt}
          variants={ceremonialTextVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
          custom={calculateCeremonialDelay(0)}
        >
          {PROMPT}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          variants={ceremonialTextVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
          custom={calculateCeremonialDelay(1)}
        >
          {SUBTITLE}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: EASE_IN_OUT_SINE }}
        >
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              void handleEnableBiometric();
            }}
          >
            Yes, please
          </button>

          <button type="button" className={styles.secondaryButton} onClick={handleSkipBiometric}>
            No, I'll use the key
          </button>
        </motion.div>
      </div>
    </motion.article>
  );
}

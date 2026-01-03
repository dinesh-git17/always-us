import { type ReactNode, useEffect, useCallback, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
  reassuranceTextVariants,
  calculateReassuranceDelay,
  ritualExitVariants,
  EASE_IN_OUT_SINE,
} from '@lib/motion';
import { useRitualStore } from '../../store/ritualStore';
import { PASSCODE_LENGTH, PASSCODE_ERROR_DELAY_MS } from '../../constants';
import { PasscodeDot } from '../PasscodeDot';
import { Keypad } from '../Keypad';

import styles from './PasscodeEntry.module.css';

const PROMPT = 'Welcome back.';

export interface PasscodeEntryProps {
  testId?: string;
}

/**
 * Returning user passcode entry.
 * Shows "Welcome back." greeting and keypad for passcode entry.
 * Gentle error handling with soft reset on wrong passcode.
 */
export function PasscodeEntry({ testId = 'passcode-entry' }: PasscodeEntryProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const userName = useRitualStore((state) => state.userName);
  const passcodeAttempt = useRitualStore((state) => state.passcodeAttempt);
  const appendDigit = useRitualStore((state) => state.appendDigit);
  const deleteDigit = useRitualStore((state) => state.deleteDigit);
  const clearPasscodeAttempt = useRitualStore((state) => state.clearPasscodeAttempt);
  const verifyPasscode = useRitualStore((state) => state.verifyPasscode);
  const setStep = useRitualStore((state) => state.setStep);

  const [showError, setShowError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle passcode completion
  const handlePasscodeComplete = useCallback((): void => {
    if (isTransitioning) return;

    const isCorrect = verifyPasscode(passcodeAttempt);

    if (isCorrect) {
      // Correct - transition to app
      setIsTransitioning(true);
      setTimeout(() => {
        setStep('threshold');
      }, 200);
    } else {
      // Incorrect - show error and reset
      setShowError(true);
      setIsTransitioning(true);

      setTimeout(() => {
        clearPasscodeAttempt();
        setShowError(false);
        setIsTransitioning(false);
      }, PASSCODE_ERROR_DELAY_MS + 300);
    }
  }, [passcodeAttempt, isTransitioning, verifyPasscode, clearPasscodeAttempt, setStep]);

  // Auto-verify when passcode is complete
  useEffect(() => {
    if (passcodeAttempt.length === PASSCODE_LENGTH && !isTransitioning) {
      // Small delay to let the last dot animate
      const timer = setTimeout(handlePasscodeComplete, 200);
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
  }, [passcodeAttempt, handlePasscodeComplete, isTransitioning]);

  // Handle digit press
  const handleDigitPress = (digit: string): void => {
    if (passcodeAttempt.length < PASSCODE_LENGTH && !isTransitioning) {
      appendDigit(digit);
    }
  };

  // Handle backspace
  const handleBackspace = (): void => {
    if (!isTransitioning) {
      deleteDigit();
    }
  };

  // Personalized greeting if name is available
  const greeting = userName ? `Welcome back, ${userName}.` : PROMPT;

  return (
    <motion.article
      className={styles.container}
      data-testid={testId}
      aria-label="Passcode entry"
      variants={ritualExitVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.content}>
        {/* Greeting */}
        <motion.h1
          className={styles.prompt}
          variants={shouldAnimate ? reassuranceTextVariants : undefined}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
          custom={calculateReassuranceDelay(0)}
        >
          {greeting}
        </motion.h1>

        {/* Passcode dots */}
        <motion.div
          className={styles.dots}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE_IN_OUT_SINE }}
          role="status"
          aria-label={`Passcode: ${String(passcodeAttempt.length)} of ${String(PASSCODE_LENGTH)} digits entered`}
        >
          {Array.from({ length: PASSCODE_LENGTH }).map((_, index) => (
            <PasscodeDot
              key={index}
              index={index}
              filled={index < passcodeAttempt.length}
              error={showError}
            />
          ))}
        </motion.div>

        {/* Keypad */}
        <motion.div
          className={styles.keypadContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE_IN_OUT_SINE }}
        >
          <Keypad
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            disabled={isTransitioning}
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

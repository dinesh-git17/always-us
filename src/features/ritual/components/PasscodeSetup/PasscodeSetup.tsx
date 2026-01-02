import { type ReactNode, useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';

import { reassuranceTextVariants, calculateReassuranceDelay } from '@lib/motion';
import { useRitualStore } from '../../store/ritualStore';
import { PASSCODE_LENGTH, PASSCODE_ERROR_DELAY_MS } from '../../constants';
import { PasscodeDot } from '../PasscodeDot';
import { Keypad } from '../Keypad';

import styles from './PasscodeSetup.module.css';

/** Prompts for each phase of passcode setup */
const PROMPTS = {
  create: 'Choose a key just for us',
  confirm: 'Once more, to be sure.',
  error: "Let's try that again.",
} as const;

/** Easing curve: easeInOutSine - ceremonial feeling */
const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1] as const;

export interface PasscodeSetupProps {
  testId?: string;
}

/**
 * Passcode creation flow.
 * Two phases: enter passcode, then confirm passcode.
 * Soft reset on mismatch (no shaking, just fade and retry).
 */
export function PasscodeSetup({ testId = 'passcode-setup' }: PasscodeSetupProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const currentStep = useRitualStore((state) => state.currentStep);
  const passcodeAttempt = useRitualStore((state) => state.passcodeAttempt);
  const appendDigit = useRitualStore((state) => state.appendDigit);
  const deleteDigit = useRitualStore((state) => state.deleteDigit);
  const clearPasscodeAttempt = useRitualStore((state) => state.clearPasscodeAttempt);
  const setFirstPasscodeEntry = useRitualStore((state) => state.setFirstPasscodeEntry);
  const setPasscode = useRitualStore((state) => state.setPasscode);
  const setStep = useRitualStore((state) => state.setStep);

  const [showError, setShowError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Determine current phase
  const isConfirmPhase = currentStep === 'passcode_confirm';

  // Determine current prompt
  const getPrompt = (): string => {
    if (showError) return PROMPTS.error;
    return isConfirmPhase ? PROMPTS.confirm : PROMPTS.create;
  };

  // Handle passcode completion
  // Note: Read values directly from store to avoid stale closure issues with setTimeout
  const handlePasscodeComplete = useCallback((): void => {
    if (isTransitioning) return;

    // Read current values from store to avoid stale closures
    const state = useRitualStore.getState();
    const currentAttempt = state.passcodeAttempt;
    const savedFirstEntry = state.firstPasscodeEntry;
    const isConfirm = state.currentStep === 'passcode_confirm';

    if (!isConfirm) {
      // First entry - save and move to confirm
      setIsTransitioning(true);
      setFirstPasscodeEntry(currentAttempt);
      clearPasscodeAttempt();

      setTimeout(() => {
        setStep('passcode_confirm');
        setIsTransitioning(false);
      }, 300);
    } else {
      // Confirm entry - check match
      if (currentAttempt === savedFirstEntry) {
        // Match - save and proceed to biometric
        setIsTransitioning(true);
        setPasscode(currentAttempt);

        setTimeout(() => {
          setStep('biometric_enroll');
          setIsTransitioning(false);
        }, 300);
      } else {
        // Mismatch - show error and reset
        setShowError(true);
        setIsTransitioning(true);

        setTimeout(() => {
          clearPasscodeAttempt();
          setShowError(false);
          setStep('passcode_create');
          setFirstPasscodeEntry('');
          setIsTransitioning(false);
        }, PASSCODE_ERROR_DELAY_MS + 500);
      }
    }
  }, [isTransitioning, setFirstPasscodeEntry, clearPasscodeAttempt, setStep, setPasscode]);

  // Auto-submit when passcode is complete
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

  // Prompt animation key (changes on phase change or error)
  const promptKey = `${currentStep}-${showError ? 'error' : 'normal'}`;

  return (
    <article className={styles.container} data-testid={testId} aria-label="Passcode setup">
      <div className={styles.content}>
        {/* Prompt */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={promptKey}
            className={styles.prompt}
            variants={shouldAnimate ? reassuranceTextVariants : undefined}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            custom={calculateReassuranceDelay(0)}
          >
            {getPrompt()}
          </motion.h1>
        </AnimatePresence>

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
    </article>
  );
}

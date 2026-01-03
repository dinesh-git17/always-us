import { type ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { EASE_IN_OUT_SINE } from '@lib/motion';
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

export interface PasscodeSetupProps {
  testId?: string;
}

/**
 * Passcode creation flow.
 * Two phases: enter passcode, then confirm passcode.
 * Soft reset on mismatch (no shaking, just fade and retry).
 */
export function PasscodeSetup({ testId = 'passcode-setup' }: PasscodeSetupProps): ReactNode {
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

  // Refs for atomic guard checking to prevent race conditions
  const isTransitioningRef = useRef(false);
  const hasCompletedRef = useRef(false);

  // Reset completion ref when step changes to passcode_create
  useEffect(() => {
    if (currentStep === 'passcode_create') {
      hasCompletedRef.current = false;
    }
  }, [currentStep]);

  // Determine current phase
  const isConfirmPhase = currentStep === 'passcode_confirm';

  // Determine current prompt
  const getPrompt = (): string => {
    if (showError) return PROMPTS.error;
    return isConfirmPhase ? PROMPTS.confirm : PROMPTS.create;
  };

  // Handle passcode completion
  // Note: Read values directly from store to avoid stale closure issues with setTimeout
  // Uses refs for atomic guard checking to prevent race conditions
  const handlePasscodeComplete = useCallback((): void => {
    // Double-guard with refs for atomic checks
    if (isTransitioningRef.current || hasCompletedRef.current) return;

    // Read current values from store to avoid stale closures
    const state = useRitualStore.getState();
    const currentAttempt = state.passcodeAttempt;
    const savedFirstEntry = state.firstPasscodeEntry;
    const isConfirm = state.currentStep === 'passcode_confirm';

    // Set guards immediately
    isTransitioningRef.current = true;
    setIsTransitioning(true);

    if (!isConfirm) {
      // First entry - save and move to confirm
      setFirstPasscodeEntry(currentAttempt);
      clearPasscodeAttempt();

      setTimeout(() => {
        setStep('passcode_confirm');
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }, 300);
    } else {
      // Confirm entry - check match
      if (currentAttempt === savedFirstEntry) {
        // Match - save and proceed to biometric
        hasCompletedRef.current = true;
        setPasscode(currentAttempt);

        setTimeout(() => {
          setStep('biometric_enroll');
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        }, 300);
      } else {
        // Mismatch - show error and reset
        setShowError(true);

        setTimeout(() => {
          clearPasscodeAttempt();
          setShowError(false);
          setStep('passcode_create');
          setFirstPasscodeEntry('');
          isTransitioningRef.current = false;
          setIsTransitioning(false);
        }, PASSCODE_ERROR_DELAY_MS + 500);
      }
    }
  }, [setFirstPasscodeEntry, clearPasscodeAttempt, setStep, setPasscode]);

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

  // Content key for AnimatePresence - changes on phase change or error
  const contentKey = `${currentStep}-${showError ? 'error' : 'normal'}`;

  // Variants for content fade in/out
  const contentVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: EASE_IN_OUT_SINE,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: EASE_IN_OUT_SINE,
      },
    },
  };

  return (
    <motion.article
      className={styles.container}
      data-testid={testId}
      aria-label="Passcode setup"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_IN_OUT_SINE } }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey}
          className={styles.content}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Prompt */}
          <motion.h1
            className={styles.prompt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE_IN_OUT_SINE }}
          >
            {getPrompt()}
          </motion.h1>

          {/* Passcode dots */}
          <motion.div
            className={styles.dots}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: EASE_IN_OUT_SINE }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: EASE_IN_OUT_SINE }}
          >
            <Keypad
              onDigitPress={handleDigitPress}
              onBackspace={handleBackspace}
              disabled={isTransitioning}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.article>
  );
}

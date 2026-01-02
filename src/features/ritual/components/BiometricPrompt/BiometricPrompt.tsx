import { type ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { useRitualStore } from '../../store/ritualStore';
import { useBiometric } from '../../hooks/useBiometric';
import { PasscodeEntry } from '../PasscodeEntry';

import styles from './BiometricPrompt.module.css';

/** Easing curve: easeInOutSine - ceremonial feeling */
const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1] as const;

export interface BiometricPromptProps {
  testId?: string;
}

/**
 * Biometric authentication for returning users.
 * Auto-triggers Face ID on mount. Falls back to PasscodeEntry on failure.
 */
export function BiometricPrompt({ testId = 'biometric-prompt' }: BiometricPromptProps): ReactNode {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [showPasscode, setShowPasscode] = useState(false);

  const userName = useRitualStore((state) => state.userName);
  const setStep = useRitualStore((state) => state.setStep);

  const { authenticate, isAvailable } = useBiometric();

  // Auto-trigger biometric on mount
  useEffect(() => {
    const attemptBiometric = async (): Promise<void> => {
      if (!isAvailable) {
        // Biometric not available - show passcode
        setIsAuthenticating(false);
        setShowPasscode(true);
        return;
      }

      try {
        const success = await authenticate();
        if (success) {
          // Success - go to threshold
          setStep('threshold');
        } else {
          // Failed - show passcode
          setIsAuthenticating(false);
          setShowPasscode(true);
        }
      } catch {
        // Error - show passcode
        setIsAuthenticating(false);
        setShowPasscode(true);
      }
    };

    // Small delay to let the UI settle before prompting
    const timer = setTimeout(() => {
      void attemptBiometric();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [authenticate, isAvailable, setStep]);

  // Show passcode entry if biometric failed
  if (showPasscode) {
    return <PasscodeEntry />;
  }

  // Show loading/authenticating state
  return (
    <article className={styles.container} data-testid={testId} aria-label="Face ID authentication">
      <div className={styles.content}>
        {/* Pulsing indicator */}
        <motion.div
          className={styles.pulse}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut' as const,
            repeat: Infinity,
          }}
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

        {/* Greeting */}
        <motion.p
          className={styles.greeting}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE_IN_OUT_SINE }}
        >
          {userName ? `Hi, ${userName}.` : 'Welcome back.'}
        </motion.p>

        {isAuthenticating && (
          <motion.p
            className={styles.status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.5, delay: 0.5, ease: EASE_IN_OUT_SINE }}
          >
            Looking for you...
          </motion.p>
        )}
      </div>
    </article>
  );
}

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import styles from './Keypad.module.css';

export interface KeypadProps {
  /** Callback when a digit is pressed */
  onDigitPress: (digit: string) => void;
  /** Callback when backspace is pressed */
  onBackspace: () => void;
  /** Whether the keypad is disabled */
  disabled?: boolean;
  testId?: string;
}

/** Keypad layout: rows of keys */
const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'backspace'],
] as const;

/** Easing curve for button press animation */
const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/**
 * Numeric keypad for passcode entry.
 * 3x4 grid with digits 0-9, empty space, and backspace.
 * Provides haptic feedback on key press.
 */
export function Keypad({
  onDigitPress,
  onBackspace,
  disabled = false,
  testId = 'keypad',
}: KeypadProps): ReactNode {
  // Trigger haptic feedback
  const triggerHaptic = async (): Promise<void> => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Haptics not available (web/simulator) - silent fail
    }
  };

  // Handle key press
  const handleKeyPress = (key: string): void => {
    if (disabled) return;

    void triggerHaptic();

    if (key === 'backspace') {
      onBackspace();
    } else if (key !== '') {
      onDigitPress(key);
    }
  };

  return (
    <div className={styles.keypad} data-testid={testId} role="group" aria-label="Numeric keypad">
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((key, keyIndex) => {
            if (key === '') {
              // Empty spacer
              return <div key={keyIndex} className={styles.spacer} />;
            }

            const isBackspace = key === 'backspace';

            return (
              <motion.button
                key={key}
                type="button"
                className={styles.key}
                onClick={() => {
                  handleKeyPress(key);
                }}
                disabled={disabled}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.1, ease: EASE_OUT_QUART }}
                aria-label={isBackspace ? 'Delete' : key}
              >
                {isBackspace ? (
                  <svg
                    className={styles.backspaceIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 6H8l-6 6 6 6h13a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" />
                    <path d="m16 9-4 6M12 9l4 6" />
                  </svg>
                ) : (
                  <span className={styles.digit}>{key}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

import { type ReactNode, useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ceremonialTextVariants,
  calculateCeremonialDelay,
  CEREMONIAL_ANIMATION,
  EASE_IN_OUT_SINE,
} from '@lib/motion';
import { useKeyboardAvoidance } from '@hooks/useKeyboardAvoidance';
import { useRitualStore } from '../../store/ritualStore';
import { normalizeName } from '../../utils/nameNormalizer';

import styles from './NameCapture.module.css';

const PROMPT = 'Who is opening this?';

/** Soft prompt shown when name doesn't match expected */
const SOFT_PROMPT = "Is that how you'd like me to call you?";

export interface NameCaptureProps {
  testId?: string;
}

/**
 * First step of the ritual: Name capture.
 * Asks a poetic question and normalizes the user's response.
 * Shows recognition ("Hi, Carolina.") before transitioning to passcode setup.
 */
export function NameCapture({ testId = 'name-capture' }: NameCaptureProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSoftPrompt, setShowSoftPrompt] = useState(false);

  const setUserName = useRitualStore((state) => state.setUserName);
  const setStep = useRitualStore((state) => state.setStep);

  // Keyboard avoidance - animates content up when iOS keyboard opens
  const { translateY } = useKeyboardAvoidance({ offset: 30 });

  // Auto-focus input after initial animation
  useEffect(() => {
    const focusDelay = shouldAnimate
      ? (calculateCeremonialDelay(1) + CEREMONIAL_ANIMATION.duration) * 1000
      : 100;

    const timer = setTimeout(() => {
      // Prevent iOS from scrolling the viewport when focusing
      inputRef.current?.focus({ preventScroll: true });
    }, focusDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [shouldAnimate]);

  // Handle name submission
  const handleSubmit = (): void => {
    if (inputValue.trim().length === 0) return;

    const result = normalizeName(inputValue);

    if (result.displayName.length === 0) return;

    if (result.isMatch) {
      // Name matches expected - proceed with recognition
      setUserName(result.displayName);
      setStep('name_recognition');
    } else if (!showSoftPrompt) {
      // Name doesn't match - show soft prompt first time
      setShowSoftPrompt(true);
    } else {
      // User confirmed with soft prompt - accept any name
      setUserName(result.displayName);
      setStep('name_recognition');
    }
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Variants for input container breathing effect
  const inputContainerVariants = {
    idle: {
      opacity: 1,
    },
    focused: {
      opacity: [1, 0.9, 1],
      transition: {
        duration: 3,
        ease: 'easeInOut' as const,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
  };

  return (
    <motion.article
      className={styles.container}
      data-testid={testId}
      aria-label="Name capture"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE_IN_OUT_SINE } }}
      style={{ y: translateY }}
    >
      <div className={styles.content}>
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

        {/* Input container with underline */}
        <motion.div
          className={styles.inputContainer}
          variants={shouldAnimate ? inputContainerVariants : undefined}
          animate={isFocused ? 'focused' : 'idle'}
          initial="idle"
        >
          <motion.div
            className={styles.inputWrapper}
            variants={ceremonialTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'}
            animate="visible"
            custom={calculateCeremonialDelay(1)}
          >
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSoftPrompt(false);
              }}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              onKeyDown={handleKeyDown}
              autoCapitalize="words"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Enter your name"
              placeholder=""
            />
            <div className={styles.underline} data-focused={isFocused} />
          </motion.div>
        </motion.div>

        {/* Soft prompt for non-matching names */}
        {showSoftPrompt && (
          <motion.p
            className={styles.softPrompt}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_IN_OUT_SINE }}
          >
            {SOFT_PROMPT}
          </motion.p>
        )}

        {/* Submit hint */}
        {inputValue.trim().length > 0 && (
          <motion.button
            type="button"
            className={styles.submitHint}
            onClick={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            aria-label="Continue"
          >
            Press Enter to continue
          </motion.button>
        )}
      </div>
    </motion.article>
  );
}

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import styles from './PasscodeDot.module.css';

export interface PasscodeDotProps {
  /** Whether this dot is filled (digit entered) */
  filled: boolean;
  /** Index of this dot (0-3) for staggered animation */
  index: number;
  /** Whether to show error state (shake animation) */
  error?: boolean;
  testId?: string;
}

/** Easing curve: easeOutQuint - smooth fill animation */
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/** Easing curve: easeInOutSine - ceremonial feeling */
const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1] as const;

/**
 * Single passcode dot with liquid fill animation.
 * Shows as empty diamond (◇) when unfilled, filled diamond (◆) when filled.
 * Animates with scale and opacity for a "liquid filling" effect.
 */
export function PasscodeDot({
  filled,
  index,
  error = false,
  testId = 'passcode-dot',
}: PasscodeDotProps): ReactNode {
  // Staggered delay for fill animation
  const fillDelay = index * 0.05;

  // Error shake animation
  const errorShakeVariants = {
    shake: {
      x: [0, -8, 8, -6, 6, -4, 4, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <motion.div
      className={styles.container}
      data-testid={`${testId}-${String(index)}`}
      variants={error ? errorShakeVariants : undefined}
      animate={error ? 'shake' : undefined}
      aria-hidden="true"
    >
      {/* Empty diamond (always visible as base) */}
      <motion.div
        className={styles.dotEmpty}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: filled ? 0 : 0.4 }}
        transition={{ duration: 0.15, ease: EASE_IN_OUT_SINE }}
      />

      {/* Filled diamond (animated in/out) */}
      <motion.div
        className={styles.dotFilled}
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: filled ? 1 : 0,
          opacity: filled ? 1 : 0,
        }}
        transition={{
          duration: 0.15,
          delay: filled ? fillDelay : 0,
          ease: EASE_OUT_QUINT,
        }}
      />
    </motion.div>
  );
}

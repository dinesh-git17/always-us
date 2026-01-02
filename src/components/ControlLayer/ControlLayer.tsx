import { useEffect, useState, useCallback, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

import { useNavigation } from '@features/navigation';

import styles from './ControlLayer.module.css';

/** Duration in milliseconds before showing idle hint pulse */
const IDLE_HINT_DELAY_MS = 5000;

/** Heartbeat pulse animation for the Next arrow when idle */
const pulseVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 0.6,
  },
  pulsing: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/** Static state for the Back arrow */
const staticVariants: Variants = {
  visible: {
    scale: 1,
    opacity: 0.6,
  },
};

export interface ControlLayerProps {
  /** Optional callback when navigation occurs */
  onNavigate?: (direction: 'next' | 'prev') => void;
}

/**
 * Transparent overlay providing subtle navigation hints and tap zones.
 * Displays chevron indicators with heartbeat pulse on Next arrow after idle timeout.
 */
export function ControlLayer({ onNavigate }: ControlLayerProps): ReactNode {
  const { next, prev, canGoNext, canGoPrev } = useNavigation();
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset idle timer and restart countdown
  const resetIdleTimer = useCallback((): void => {
    setIsIdle(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_HINT_DELAY_MS);
  }, []);

  // Initialize idle timer and listen for global interactions
  useEffect(() => {
    // Start initial timer
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_HINT_DELAY_MS);

    // Reset on any user interaction
    const handleInteraction = (): void => {
      resetIdleTimer();
    };

    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction);

    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [resetIdleTimer]);

  const handleNextTap = useCallback((): void => {
    if (canGoNext) {
      next();
      onNavigate?.('next');
    }
  }, [canGoNext, next, onNavigate]);

  const handlePrevTap = useCallback((): void => {
    if (canGoPrev) {
      prev();
      onNavigate?.('prev');
    }
  }, [canGoPrev, prev, onNavigate]);

  return (
    <div className={styles.controlLayer} aria-hidden="true">
      {/* Back tap zone - bottom left 20% */}
      <AnimatePresence>
        {canGoPrev && (
          <motion.button
            type="button"
            className={styles.tapZoneLeft}
            onClick={handlePrevTap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Go to previous page"
          >
            <motion.span className={styles.chevron} variants={staticVariants} animate="visible">
              <ChevronLeftIcon />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Next tap zone - bottom right 20% */}
      <AnimatePresence>
        {canGoNext && (
          <motion.button
            type="button"
            className={styles.tapZoneRight}
            onClick={handleNextTap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Go to next page"
          >
            <motion.span
              className={styles.chevron}
              variants={pulseVariants}
              animate={isIdle ? 'pulsing' : 'idle'}
            >
              <ChevronRightIcon />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronLeftIcon(): ReactNode {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(): ReactNode {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

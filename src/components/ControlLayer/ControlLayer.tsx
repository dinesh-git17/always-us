import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigation } from '@features/navigation';

import styles from './ControlLayer.module.css';

/** Duration in milliseconds before showing idle hint pulse */
const IDLE_HINT_DELAY_MS = 5000;

export interface ControlLayerProps {
  /** Optional callback when navigation occurs */
  onNavigate?: (direction: 'next' | 'prev') => void;
}

/**
 * Transparent overlay providing subtle navigation hints and tap zones.
 * Displays chevron indicators that pulse after idle timeout.
 */
export function ControlLayer({ onNavigate }: ControlLayerProps): ReactNode {
  const { next, prev, canGoNext, canGoPrev } = useNavigation();
  const [isIdle, setIsIdle] = useState(false);

  // Reset idle timer on any interaction
  const resetIdleTimer = useCallback((): void => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_HINT_DELAY_MS);

    return (): void => {
      clearTimeout(timer);
    };
  }, [canGoNext, canGoPrev]);

  const handleNextTap = useCallback((): void => {
    if (canGoNext) {
      resetIdleTimer();
      next();
      onNavigate?.('next');
    }
  }, [canGoNext, next, onNavigate, resetIdleTimer]);

  const handlePrevTap = useCallback((): void => {
    if (canGoPrev) {
      resetIdleTimer();
      prev();
      onNavigate?.('prev');
    }
  }, [canGoPrev, prev, onNavigate, resetIdleTimer]);

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
            <motion.span
              className={styles.chevron}
              animate={isIdle ? { opacity: [0.6, 0.8, 0.6] } : { opacity: 0.6 }}
              transition={isIdle ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            >
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
              animate={isIdle ? { opacity: [0.6, 0.8, 0.6] } : { opacity: 0.6 }}
              transition={isIdle ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
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

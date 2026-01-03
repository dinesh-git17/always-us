import { type ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PiHandSwipeLeft } from 'react-icons/pi';

import { useNavigation } from '@features/navigation';

import styles from './SwipeHint.module.css';

/** Delay before hint appears (after epigraph settles on Welcome page) */
const HINT_DELAY_MS = 10600;

/** Distance the icon travels leftward */
const SWIPE_DISTANCE = 35;

/** Duration of each swipe animation */
const SWIPE_DURATION = 0.8;

/** Pause between swipe loops */
const LOOP_PAUSE = 0.4;

/** Number of times to loop the animation */
const LOOP_COUNT = 3;

/** Duration of fade in/out */
const FADE_DURATION = 0.5;

/**
 * Subtle swipe hint that appears on the Welcome page after content settles.
 * Shows a hand swipe icon that animates leftward 3 times, then fades out.
 * Only visible on page 0 and respects reduced motion preferences.
 */
export function SwipeHint(): ReactNode {
  const { currentStepIndex } = useNavigation();
  const prefersReducedMotion = useReducedMotion();

  const [showState, setShowState] = useState<'hidden' | 'visible' | 'fading'>('hidden');
  const [loopCount, setLoopCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isWelcomePage = currentStepIndex === 0;
  const shouldRender = isWelcomePage && !prefersReducedMotion;

  // Start timer when on Welcome page, cleanup when leaving
  useEffect(() => {
    if (!shouldRender) {
      // Reset state when conditions change - this is a cleanup, not cascading
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // Use a microtask to avoid synchronous setState in effect body
      queueMicrotask(() => {
        setShowState('hidden');
        setLoopCount(0);
      });
      return;
    }

    timerRef.current = setTimeout(() => {
      setShowState('visible');
    }, HINT_DELAY_MS);

    return (): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [shouldRender]);

  // Handle animation loop completion
  const handleSwipeComplete = useCallback((): void => {
    setLoopCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= LOOP_COUNT) {
        setShowState('fading');
      }
      return newCount;
    });
  }, []);

  // Handle fade out completion
  const handleFadeOutComplete = useCallback((): void => {
    if (showState === 'fading') {
      setShowState('hidden');
    }
  }, [showState]);

  // Don't render anything if not on Welcome page or reduced motion
  if (!shouldRender || showState === 'hidden') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: showState === 'fading' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: FADE_DURATION }}
        onAnimationComplete={handleFadeOutComplete}
        aria-hidden="true"
      >
        <motion.div
          className={styles.icon}
          initial={{ x: 0 }}
          animate={{ x: -SWIPE_DISTANCE }}
          transition={{
            duration: SWIPE_DURATION,
            ease: 'easeOut',
            repeat: 1,
            repeatType: 'reverse',
            repeatDelay: LOOP_PAUSE / 2,
          }}
          onAnimationComplete={handleSwipeComplete}
          key={loopCount}
        >
          <PiHandSwipeLeft />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

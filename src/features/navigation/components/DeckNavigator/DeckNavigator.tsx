import { type ReactElement, type ReactNode, Children, useEffect, useRef } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import { useNavigation } from '../../hooks/useNavigation';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';

import styles from './DeckNavigator.module.css';

export interface DeckNavigatorProps {
  /** Array of page components to navigate between */
  children: ReactElement[];
}

/**
 * Parallax stack animation variants for cinematic page transitions.
 * New page slides over exiting page with depth shadow effect.
 */
const romanticVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-20%',
    opacity: direction > 0 ? 1 : 0,
    zIndex: 1,
    scale: 1,
    boxShadow: direction > 0 ? '-10px 0 30px rgba(0, 0, 0, 0.12)' : 'none',
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 2,
    scale: 1,
    boxShadow: 'none',
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-20%' : '100%',
    opacity: direction > 0 ? 0 : 1,
    zIndex: 0,
    scale: 0.98,
    boxShadow: direction > 0 ? 'none' : '-10px 0 30px rgba(0, 0, 0, 0.12)',
  }),
};

const springTransition = {
  x: { type: 'spring' as const, stiffness: 260, damping: 30 },
  opacity: { duration: 0.4 },
  scale: { duration: 0.3 },
};

/**
 * Triggers light haptic feedback when transition completes.
 * Gracefully handles platforms without haptic support.
 */
async function triggerTransitionHaptic(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Haptics not available on this platform (e.g., web browser)
  }
}

/**
 * Index-based view manager with parallax stack transitions.
 * Uses Framer Motion for cinematic animations and supports swipe gestures.
 */
export function DeckNavigator({ children }: DeckNavigatorProps): ReactNode {
  const { currentStepIndex, next, prev, canGoNext, canGoPrev, direction } = useNavigation();
  const previousStepRef = useRef(currentStepIndex);

  const handleSwipeLeft = (): void => {
    if (canGoNext) {
      next();
    }
  };

  const handleSwipeRight = (): void => {
    if (canGoPrev) {
      prev();
    }
  };

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    enabled: true,
  });

  // Trigger haptic feedback when page changes
  useEffect(() => {
    if (previousStepRef.current !== currentStepIndex) {
      previousStepRef.current = currentStepIndex;
      void triggerTransitionHaptic();
    }
  }, [currentStepIndex]);

  // Get all children as an array
  const pages = Children.toArray(children) as ReactElement[];
  const currentPage = pages[currentStepIndex];

  return (
    <div className={styles.container} {...swipeHandlers}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentStepIndex}
          custom={direction}
          variants={romanticVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={springTransition}
          className={styles.page}
        >
          {currentPage}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

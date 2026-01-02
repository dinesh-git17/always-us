import { type ReactElement, type ReactNode, Children } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

import { useNavigation } from '../../hooks/useNavigation';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';

import styles from './DeckNavigator.module.css';

export interface DeckNavigatorProps {
  /** Array of page components to navigate between */
  children: ReactElement[];
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.8,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0.8,
  }),
};

const springTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Index-based view manager that handles horizontal slide transitions.
 * Uses Framer Motion for spring-based animations and supports swipe gestures.
 */
export function DeckNavigator({ children }: DeckNavigatorProps): ReactNode {
  const { currentStepIndex, next, prev, canGoNext, canGoPrev, direction } = useNavigation();

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

  // Get all children as an array
  const pages = Children.toArray(children) as ReactElement[];
  const currentPage = pages[currentStepIndex];

  return (
    <div className={styles.container} {...swipeHandlers}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentStepIndex}
          custom={direction}
          variants={slideVariants}
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

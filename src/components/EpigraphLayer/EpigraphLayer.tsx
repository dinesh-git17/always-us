import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';

import { useJourneyStore } from '@features/navigation';
import { useQuoteStore } from '@lib/quotes';
import { pageConfigs } from '@features/pages';

import styles from './EpigraphLayer.module.css';

/** Animation timing constants for ethereal entrance */
const EPIGRAPH_ANIMATION = {
  duration: 1.2,
  yOffset: 10,
  targetOpacity: 0.5,
  ease: [0.37, 0, 0.63, 1], // easeInOutSine
  defaultDelay: 2.5, // Fallback if no epigraphDelay specified
} as const;

/** Framer Motion variants for epigraph fade-in with dynamic delay */
const epigraphVariants: Variants = {
  hidden: {
    opacity: 0,
    y: EPIGRAPH_ANIMATION.yOffset,
  },
  visible: (customDelay: unknown) => {
    const delay = typeof customDelay === 'number' ? customDelay : EPIGRAPH_ANIMATION.defaultDelay;
    return {
      opacity: EPIGRAPH_ANIMATION.targetOpacity,
      y: 0,
      transition: {
        delay,
        duration: EPIGRAPH_ANIMATION.duration,
        ease: EPIGRAPH_ANIMATION.ease,
      },
    };
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/** Reduced motion variant - instant appearance after delay, no translation */
const reducedMotionVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (customDelay: unknown) => {
    const delay = typeof customDelay === 'number' ? customDelay : EPIGRAPH_ANIMATION.defaultDelay;
    return {
      opacity: EPIGRAPH_ANIMATION.targetOpacity,
      transition: {
        delay,
        duration: 0,
      },
    };
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0,
    },
  },
};

/**
 * Overlay layer that displays rotating epigraph quotes at the bottom of pages.
 * Reads the current page's quoteCategory and displays the session-selected quote.
 *
 * Features:
 * - Synced with page navigation via journey store
 * - AnimatePresence for smooth transitions between quotes
 * - Respects prefers-reduced-motion for accessibility
 * - Fixed positioning with pointer-events-none to not interfere with navigation
 */
export function EpigraphLayer(): ReactNode {
  const currentStepIndex = useJourneyStore((state) => state.currentStepIndex);
  const getQuote = useQuoteStore((state) => state.getQuote);
  const prefersReducedMotion = useReducedMotion();

  // Get the current page config and its quote category
  const currentPageConfig = pageConfigs[currentStepIndex];
  const quoteCategory = currentPageConfig.quoteCategory ?? null;
  const epigraphDelay = currentPageConfig.epigraphDelay ?? EPIGRAPH_ANIMATION.defaultDelay;

  // Get the session quote for this category
  const quote = getQuote(quoteCategory);

  const variants = prefersReducedMotion ? reducedMotionVariants : epigraphVariants;

  return (
    <div className={styles.layer} aria-live="polite">
      <AnimatePresence mode="wait">
        {quote && (
          <motion.aside
            key={`epigraph-${String(currentStepIndex)}`}
            className={styles.epigraph}
            aria-label="Quote"
            data-testid={`epigraph-${String(currentStepIndex)}`}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={epigraphDelay}
          >
            <p className={styles.text}>{quote}</p>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

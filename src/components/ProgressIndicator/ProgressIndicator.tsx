import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigation, FINAL_PAGE_INDEX } from '@features/navigation';
import { fadeInVariants } from '@lib/motion';

import styles from './ProgressIndicator.module.css';

export interface ProgressIndicatorProps {
  /** Optional class name for container customization */
  className?: string;
}

/**
 * Subtle progress bar showing current position in the journey.
 * Positioned at the top of the app, below the status bar safe area.
 * Hidden on the welcome page (step 0) and final page to create intimate bookends.
 * Fades in smoothly when transitioning from page 0 to page 1.
 */
export function ProgressIndicator({ className }: ProgressIndicatorProps): ReactNode {
  const { currentStepIndex, totalSteps } = useNavigation();

  // Calculate progress percentage (1-indexed for display)
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  const containerClass = className ? `${styles.container} ${className}` : styles.container;

  const currentStep = currentStepIndex + 1;
  const ariaLabel = `Step ${String(currentStep)} of ${String(totalSteps)}`;
  const widthStyle = `${String(progressPercent)}%`;

  // Show progress indicator only after welcome page (step 0) and before final page
  // Welcome and final "I love you" pages have no progress bar for intimate bookends
  const isVisible = currentStepIndex > 0 && currentStepIndex < FINAL_PAGE_INDEX;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={containerClass}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={ariaLabel}
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className={styles.track}>
            {/* Inline style exception: dynamic width based on progress state */}
            <div className={styles.bar} style={{ width: widthStyle }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

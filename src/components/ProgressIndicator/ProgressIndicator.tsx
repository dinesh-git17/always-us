import type { ReactNode } from 'react';

import { useNavigation } from '@features/navigation';

import styles from './ProgressIndicator.module.css';

export interface ProgressIndicatorProps {
  /** Optional class name for container customization */
  className?: string;
}

/**
 * Subtle progress bar showing current position in the journey.
 * Positioned at the top of the app, below the status bar safe area.
 * Hidden on the welcome page (step 0) to reinforce the timeless, unhurried feel.
 */
export function ProgressIndicator({ className }: ProgressIndicatorProps): ReactNode {
  const { currentStepIndex, totalSteps } = useNavigation();

  // Hide progress indicator on welcome page to create a "safe container" experience
  if (currentStepIndex === 0) {
    return null;
  }

  // Calculate progress percentage (1-indexed for display)
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  const containerClass = className ? `${styles.container} ${className}` : styles.container;

  const currentStep = currentStepIndex + 1;
  const ariaLabel = `Step ${String(currentStep)} of ${String(totalSteps)}`;
  const widthStyle = `${String(progressPercent)}%`;

  return (
    <div
      className={containerClass}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={ariaLabel}
    >
      <div className={styles.track}>
        {/* Inline style exception: dynamic width based on progress state */}
        <div className={styles.bar} style={{ width: widthStyle }} />
      </div>
    </div>
  );
}

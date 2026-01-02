import type { ReactNode } from 'react';

import { useNavigation } from '@features/navigation';
import { Button } from '@components/Button';

import styles from './ActionBar.module.css';

export interface ActionBarProps {
  /** Label for the primary action button */
  primaryLabel?: string;
  /** Label for the back button */
  backLabel?: string;
  /** Whether to show the back button */
  showBack?: boolean;
  /** Whether the primary action is loading */
  loading?: boolean;
  /** Callback when primary action is pressed (overrides default navigation) */
  onPrimaryPress?: () => void;
  /** Callback when back is pressed (overrides default navigation) */
  onBackPress?: () => void;
}

/**
 * Fixed footer area containing navigation buttons.
 * Positioned at the bottom of the screen, respecting safe areas.
 */
export function ActionBar({
  primaryLabel = 'Continue',
  backLabel = 'Back',
  showBack = true,
  loading = false,
  onPrimaryPress,
  onBackPress,
}: ActionBarProps): ReactNode {
  const { next, prev, canGoNext, canGoPrev, currentStepIndex, totalSteps } = useNavigation();

  const handlePrimaryPress = (): void => {
    if (onPrimaryPress) {
      onPrimaryPress();
    } else {
      next();
    }
  };

  const handleBackPress = (): void => {
    if (onBackPress) {
      onBackPress();
    } else {
      prev();
    }
  };

  // On the last step, change the button label
  const isLastStep = currentStepIndex === totalSteps - 1;
  const displayPrimaryLabel = isLastStep ? 'Complete' : primaryLabel;

  // Don't show back button on first step or if explicitly hidden
  const shouldShowBack = showBack && canGoPrev;

  const containerClass = shouldShowBack
    ? styles.actionBar
    : `${styles.actionBar} ${styles.primaryOnly}`;

  return (
    <nav className={containerClass} aria-label="Journey navigation">
      {shouldShowBack && (
        <Button
          variant="secondary"
          onClick={handleBackPress}
          className={styles.backButton}
          ariaLabel="Go to previous step"
        >
          {backLabel}
        </Button>
      )}
      <Button
        variant="primary"
        onClick={handlePrimaryPress}
        disabled={!canGoNext && !isLastStep}
        loading={loading}
        className={styles.primaryButton}
        ariaLabel={isLastStep ? 'Complete journey' : 'Go to next step'}
      >
        {displayPrimaryLabel}
      </Button>
    </nav>
  );
}

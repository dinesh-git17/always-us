import type { ReactNode, ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Button content */
  children: ReactNode;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary';
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Whether the button should take full width */
  fullWidth?: boolean;
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * Primary button component with loading and disabled states.
 * Meets iOS accessibility guidelines with 44x44pt minimum touch target.
 */
export function Button({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled = false,
  ariaLabel,
  className,
  type = 'button',
  ...props
}: ButtonProps): ReactNode {
  const classNames = [
    styles.button,
    styles[variant],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </button>
  );
}

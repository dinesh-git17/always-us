import type { ReactNode } from 'react';

import { useBodyScrollLock } from '@hooks/useBodyScrollLock';

import styles from './AppShell.module.css';

export interface AppShellProps {
  /** Content for the header area (progress indicator) */
  header?: ReactNode;
  /** Main content area (deck navigator with pages) */
  children: ReactNode;
  /** Content for the footer area (action bar) */
  footer?: ReactNode;
}

/**
 * Root-level layout component that serves as the physical container for all screens.
 * Handles iOS safe areas, prevents rubber-band scrolling, and provides the app shell structure.
 */
export function AppShell({ header, children, footer }: AppShellProps): ReactNode {
  // Lock body scroll to prevent iOS rubber-band effect
  useBodyScrollLock();

  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        {header && <header className={styles.header}>{header}</header>}
        <main className={styles.main}>{children}</main>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

import { useBodyScrollLock } from '@hooks/useBodyScrollLock';

import styles from './AppShell.module.css';

export interface AppShellProps {
  /** Content for the header area (progress indicator) */
  header?: ReactNode;
  /** Main content area (deck navigator with pages) */
  children: ReactNode;
  /** Optional overlay layer (control hints) */
  overlay?: ReactNode;
}

/**
 * Root-level layout component that serves as the physical container for all screens.
 * Handles iOS safe areas, prevents rubber-band scrolling, and provides the app shell structure.
 * Content extends behind the bottom safe area for immersive display.
 */
export function AppShell({ header, children, overlay }: AppShellProps): ReactNode {
  // Lock body scroll to prevent iOS rubber-band effect
  useBodyScrollLock();

  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        {header && <header className={styles.header}>{header}</header>}
        <main className={styles.main}>{children}</main>
      </div>
      {overlay}
    </div>
  );
}

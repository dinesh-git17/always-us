import type { ReactNode } from 'react';

import styles from './Page.module.css';

export interface PageProps {
  /** Page title displayed prominently */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Page content */
  children?: ReactNode;
  /** Test ID for automated testing (e.g., "page-0") */
  testId: string;
}

/**
 * Reusable page wrapper component that provides consistent layout
 * and semantic structure for all journey pages.
 */
export function Page({ title, subtitle, children, testId }: PageProps): ReactNode {
  return (
    <article className={styles.page} data-testid={testId} data-scrollable>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>
      {children && <div className={styles.content}>{children}</div>}
    </article>
  );
}

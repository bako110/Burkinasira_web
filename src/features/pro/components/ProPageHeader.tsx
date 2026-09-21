import type { ReactNode } from 'react';

import styles from '../pages/ProPageWrapper.module.css';

interface ProPageHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function ProPageHeader({ kicker, title, subtitle, children }: ProPageHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerRow}>
        <div>
          {kicker && <span className={styles.kicker}>{kicker}</span>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

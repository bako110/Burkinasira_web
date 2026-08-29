import type { ReactNode } from 'react';

import styles from '../pages/ProPageWrapper.module.css';

interface ProPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function ProPageHeader({ title, subtitle, children }: ProPageHeaderProps) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </div>
  );
}

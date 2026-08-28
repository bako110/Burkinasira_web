import { Link } from 'react-router-dom';

import styles from './AuthHeader.module.css';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <Link to="/" className={styles.brand}>
          <img src="/logo.png" alt="" className={styles.logo} />
        </Link>
        <h1 className={styles.title}>{title}</h1>
      </div>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

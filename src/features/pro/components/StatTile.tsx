import type { ComponentType } from 'react';

import styles from './StatTile.module.css';

interface StatTileProps {
  label: string;
  value: string;
  Icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
}

export function StatTile({ label, value, Icon }: StatTileProps) {
  return (
    <div className={styles.tile}>
      <div className={styles.tileHeader}>
        <span className={styles.label}>{label}</span>
        {Icon && (
          <span className={styles.iconWrap}>
            <Icon size={14} strokeWidth={2} />
          </span>
        )}
      </div>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

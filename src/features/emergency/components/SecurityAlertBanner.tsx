import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

import type { AlertSeverity, SecurityAlert } from '../types';
import styles from './SecurityAlertBanner.module.css';

const SEVERITY_ICON: Record<AlertSeverity, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
};

export function SecurityAlertBanner({ alert }: { alert: SecurityAlert }) {
  const Icon = SEVERITY_ICON[alert.severity];

  return (
    <div className={clsx(styles.banner, styles[alert.severity])}>
      <Icon size={20} strokeWidth={2} className={styles.icon} />
      <div className={styles.text}>
        <p className={styles.title}>{alert.title}</p>
        <p className={styles.description}>{alert.description}</p>
      </div>
    </div>
  );
}

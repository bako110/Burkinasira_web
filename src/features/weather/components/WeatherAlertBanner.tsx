import { AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import clsx from 'clsx';

import type { WeatherAlert } from '../types';
import styles from './WeatherAlertBanner.module.css';

const ICONS = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertOctagon,
} as const;

export function WeatherAlertBanner({ alert }: { alert: WeatherAlert }) {
  const Icon = ICONS[alert.severity] ?? Info;

  return (
    <div className={clsx(styles.banner, styles[alert.severity])}>
      <Icon size={18} strokeWidth={2} className={styles.icon} />
      <div className={styles.text}>
        <p className={styles.title}>{alert.title}</p>
        <p className={styles.description}>{alert.description}</p>
      </div>
    </div>
  );
}

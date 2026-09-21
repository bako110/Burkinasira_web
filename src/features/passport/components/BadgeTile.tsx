import { Award, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import type { Badge } from '../types';
import styles from './BadgeTile.module.css';

export function BadgeTile({ badge, earned }: { badge: Badge; earned: boolean }) {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(styles.tile, earned ? styles.tileEarned : styles.tileLocked)}
      title={earned ? badge.description : t('passport.badgeLocked')}
    >
      <span className={styles.icon}>
        {earned ? <Award size={22} strokeWidth={1.75} /> : <Lock size={18} strokeWidth={1.75} />}
      </span>
      <span className={styles.name}>{badge.name}</span>
    </div>
  );
}

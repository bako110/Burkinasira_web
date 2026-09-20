import { useTranslation } from 'react-i18next';
import { LayoutGrid, Radio, Store, Wifi, Building } from 'lucide-react';
import clsx from 'clsx';

import type { ConnectivityPointType } from '../types';
import styles from './ConnectivityFilters.module.css';

const TYPES: { key: string; value: ConnectivityPointType | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'operateur_telecom', value: 'operateur_telecom', Icon: Radio },
  { key: 'point_vente_sim', value: 'point_vente_sim', Icon: Store },
  { key: 'wifi_public', value: 'wifi_public', Icon: Wifi },
  { key: 'wifi_prive', value: 'wifi_prive', Icon: Wifi },
  { key: 'coworking', value: 'coworking', Icon: Building },
  { key: 'boutique_telephonie', value: 'boutique_telephonie', Icon: Store },
];

interface ConnectivityFiltersProps {
  active: ConnectivityPointType | undefined;
  onChange: (value: ConnectivityPointType | undefined) => void;
  /** Layout vertical pour la sidebar desktop (sinon rangée scrollable mobile/tablette). */
  layout?: 'row' | 'stack';
}

export function ConnectivityFilters({ active, onChange, layout = 'row' }: ConnectivityFiltersProps) {
  const { t } = useTranslation();

  if (layout === 'stack') {
    return (
      <div className={styles.stack}>
        {TYPES.map(({ key, value, Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={key}
              type="button"
              className={clsx(styles.stackItem, isActive && styles.stackItemActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              <Icon size={17} strokeWidth={2} className={styles.stackIcon} />
              {t(`connectivity.filters.${key}`)}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.scroller}>
      <div className={styles.row}>
        {TYPES.map(({ key, value, Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={key}
              type="button"
              className={clsx(styles.chip, isActive && styles.chipActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              <Icon size={16} strokeWidth={2} />
              {t(`connectivity.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
}

export function ConnectivityFilters({ active, onChange }: ConnectivityFiltersProps) {
  const { t } = useTranslation();

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

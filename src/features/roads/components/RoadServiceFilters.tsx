import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

import type { RoadServiceType } from '../types';
import styles from './RoadServiceFilters.module.css';

const TYPES: (RoadServiceType | undefined)[] = [
  undefined,
  'station_service',
  'garage',
  'mecanicien',
  'vulcanisateur',
  'depannage',
  'remorquage',
  'lavage_auto',
  'pieces_auto',
  'parking',
  'borne_recharge',
];

interface RoadServiceFiltersProps {
  active: RoadServiceType | undefined;
  onChange: (value: RoadServiceType | undefined) => void;
}

export function RoadServiceFilters({ active, onChange }: RoadServiceFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.scroller}>
      <div className={styles.row}>
        {TYPES.map((value) => {
          const isActive = active === value;
          return (
            <button
              key={value ?? 'all'}
              type="button"
              className={clsx(styles.chip, isActive && styles.chipActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              {!value && <LayoutGrid size={16} strokeWidth={2} />}
              {value ? t(`roads.types.${value}`) : t('roads.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

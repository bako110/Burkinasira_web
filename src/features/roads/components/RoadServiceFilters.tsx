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
  /** Layout vertical pour la sidebar desktop (sinon rangée scrollable mobile/tablette). */
  layout?: 'row' | 'stack';
}

export function RoadServiceFilters({ active, onChange, layout = 'row' }: RoadServiceFiltersProps) {
  const { t } = useTranslation();

  if (layout === 'stack') {
    return (
      <div className={styles.stack}>
        {TYPES.map((value) => {
          const isActive = active === value;
          return (
            <button
              key={value ?? 'all'}
              type="button"
              className={clsx(styles.stackItem, isActive && styles.stackItemActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              {!value && <LayoutGrid size={16} strokeWidth={2} className={styles.stackIcon} />}
              {value ? t(`roads.types.${value}`) : t('roads.filters.all')}
            </button>
          );
        })}
      </div>
    );
  }

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

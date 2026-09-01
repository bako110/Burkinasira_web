import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

import type { EduOutingType } from '../types';
import styles from './EduOutingFilters.module.css';

const TYPES: (EduOutingType | undefined)[] = [
  undefined,
  'visite_historique',
  'visite_culturelle',
  'visite_scientifique',
  'visite_agricole',
  'visite_industrielle',
  'excursion_universitaire',
];

interface EduOutingFiltersProps {
  active: EduOutingType | undefined;
  onChange: (value: EduOutingType | undefined) => void;
}

export function EduOutingFilters({ active, onChange }: EduOutingFiltersProps) {
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
              {value ? t(`edu.types.${value}`) : t('edu.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

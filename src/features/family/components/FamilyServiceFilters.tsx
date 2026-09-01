import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

import type { FamilyServiceType } from '../types';
import styles from './FamilyServiceFilters.module.css';

const TYPES: (FamilyServiceType | undefined)[] = [
  undefined,
  'activite_familiale',
  'garde_enfants',
  'aire_jeux',
  'espace_repos',
  'sanitaire_public',
  'point_eau',
];

interface FamilyServiceFiltersProps {
  active: FamilyServiceType | undefined;
  onChange: (value: FamilyServiceType | undefined) => void;
}

export function FamilyServiceFilters({ active, onChange }: FamilyServiceFiltersProps) {
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
              {value ? t(`family.types.${value}`) : t('family.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

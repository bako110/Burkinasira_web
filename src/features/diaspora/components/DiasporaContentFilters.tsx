import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

import type { DiasporaContentType } from '../types';
import styles from './DiasporaContentFilters.module.css';

const TYPES: (DiasporaContentType | undefined)[] = [
  undefined,
  'circuit_culturel',
  'patrimoine_familial',
  'hebergement',
  'transport',
  'evenement_culturel',
  'service_visiteur_retour',
];

interface DiasporaContentFiltersProps {
  active: DiasporaContentType | undefined;
  onChange: (value: DiasporaContentType | undefined) => void;
}

export function DiasporaContentFilters({ active, onChange }: DiasporaContentFiltersProps) {
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
              {value ? t(`diaspora.types.${value}`) : t('diaspora.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

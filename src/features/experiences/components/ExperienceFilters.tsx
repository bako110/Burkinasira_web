import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import clsx from 'clsx';

import type { ExperienceType } from '../types';
import styles from './ExperienceFilters.module.css';

const TYPES: (ExperienceType | undefined)[] = [
  undefined,
  'rencontre_habitant',
  'visite_village',
  'decouverte_metier',
  'atelier_artisanat',
  'atelier_culinaire',
  'agritourisme',
  'balade_guidee',
  'hebergement_habitant',
  'rencontre_artiste',
];

interface ExperienceFiltersProps {
  active: ExperienceType | undefined;
  onChange: (value: ExperienceType | undefined) => void;
}

export function ExperienceFilters({ active, onChange }: ExperienceFiltersProps) {
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
              {value ? t(`experiences.types.${value}`) : t('experiences.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

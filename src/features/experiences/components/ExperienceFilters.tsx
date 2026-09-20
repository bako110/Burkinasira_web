import { useTranslation } from 'react-i18next';
import {
  LayoutGrid,
  Users,
  Home,
  Briefcase,
  Hammer,
  ChefHat,
  Sprout,
  Footprints,
  BedDouble,
  Palette,
} from 'lucide-react';
import clsx from 'clsx';

import type { ExperienceType } from '../types';
import styles from './ExperienceFilters.module.css';

const TYPES: { value: ExperienceType | undefined; Icon: typeof LayoutGrid }[] = [
  { value: undefined, Icon: LayoutGrid },
  { value: 'rencontre_habitant', Icon: Users },
  { value: 'visite_village', Icon: Home },
  { value: 'decouverte_metier', Icon: Briefcase },
  { value: 'atelier_artisanat', Icon: Hammer },
  { value: 'atelier_culinaire', Icon: ChefHat },
  { value: 'agritourisme', Icon: Sprout },
  { value: 'balade_guidee', Icon: Footprints },
  { value: 'hebergement_habitant', Icon: BedDouble },
  { value: 'rencontre_artiste', Icon: Palette },
];

interface ExperienceFiltersProps {
  active: ExperienceType | undefined;
  onChange: (value: ExperienceType | undefined) => void;
  /** Layout vertical pour la sidebar desktop (sinon rangée scrollable mobile/tablette). */
  layout?: 'row' | 'stack';
}

export function ExperienceFilters({ active, onChange, layout = 'row' }: ExperienceFiltersProps) {
  const { t } = useTranslation();

  if (layout === 'stack') {
    return (
      <div className={styles.stack}>
        {TYPES.map(({ value, Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={value ?? 'all'}
              type="button"
              className={clsx(styles.stackItem, isActive && styles.stackItemActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              <Icon size={17} strokeWidth={2} className={styles.stackIcon} />
              {value ? t(`experiences.types.${value}`) : t('experiences.filters.all')}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.scroller}>
      <div className={styles.row}>
        {TYPES.map(({ value, Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={value ?? 'all'}
              type="button"
              className={clsx(styles.chip, isActive && styles.chipActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              <Icon size={16} strokeWidth={2} />
              {value ? t(`experiences.types.${value}`) : t('experiences.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

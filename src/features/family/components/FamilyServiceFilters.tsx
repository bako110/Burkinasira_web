import { useTranslation } from 'react-i18next';
import { LayoutGrid, PartyPopper, Baby, Trees, BedDouble, ShowerHead, Droplets } from 'lucide-react';
import clsx from 'clsx';

import type { FamilyServiceType } from '../types';
import styles from './FamilyServiceFilters.module.css';

const TYPES: { value: FamilyServiceType | undefined; Icon: typeof LayoutGrid }[] = [
  { value: undefined, Icon: LayoutGrid },
  { value: 'activite_familiale', Icon: PartyPopper },
  { value: 'garde_enfants', Icon: Baby },
  { value: 'aire_jeux', Icon: Trees },
  { value: 'espace_repos', Icon: BedDouble },
  { value: 'sanitaire_public', Icon: ShowerHead },
  { value: 'point_eau', Icon: Droplets },
];

interface FamilyServiceFiltersProps {
  active: FamilyServiceType | undefined;
  onChange: (value: FamilyServiceType | undefined) => void;
  /** Layout vertical pour la sidebar desktop (sinon rangée scrollable mobile/tablette). */
  layout?: 'row' | 'stack';
}

export function FamilyServiceFilters({ active, onChange, layout = 'row' }: FamilyServiceFiltersProps) {
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
              {value ? t(`family.types.${value}`) : t('family.filters.all')}
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
              {value ? t(`family.types.${value}`) : t('family.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

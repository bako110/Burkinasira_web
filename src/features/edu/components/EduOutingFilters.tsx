import { useTranslation } from 'react-i18next';
import { LayoutGrid, Landmark, Palette, FlaskConical, Sprout, Factory, School } from 'lucide-react';
import clsx from 'clsx';

import type { EduOutingType } from '../types';
import styles from './EduOutingFilters.module.css';

const TYPES: { value: EduOutingType | undefined; Icon: typeof LayoutGrid }[] = [
  { value: undefined, Icon: LayoutGrid },
  { value: 'visite_historique', Icon: Landmark },
  { value: 'visite_culturelle', Icon: Palette },
  { value: 'visite_scientifique', Icon: FlaskConical },
  { value: 'visite_agricole', Icon: Sprout },
  { value: 'visite_industrielle', Icon: Factory },
  { value: 'excursion_universitaire', Icon: School },
];

interface EduOutingFiltersProps {
  active: EduOutingType | undefined;
  onChange: (value: EduOutingType | undefined) => void;
  /** Layout vertical pour la sidebar desktop (sinon rangée scrollable mobile/tablette). */
  layout?: 'row' | 'stack';
}

export function EduOutingFilters({ active, onChange, layout = 'row' }: EduOutingFiltersProps) {
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
              {value ? t(`edu.types.${value}`) : t('edu.filters.all')}
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
              {value ? t(`edu.types.${value}`) : t('edu.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

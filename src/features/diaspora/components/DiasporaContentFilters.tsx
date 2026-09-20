import { useTranslation } from 'react-i18next';
import { LayoutGrid, Compass, Home, Bus, PartyPopper, LifeBuoy, Landmark } from 'lucide-react';
import clsx from 'clsx';

import type { DiasporaContentType } from '../types';
import styles from './DiasporaContentFilters.module.css';

const TYPES: { value: DiasporaContentType | undefined; Icon: typeof LayoutGrid }[] = [
  { value: undefined, Icon: LayoutGrid },
  { value: 'circuit_culturel', Icon: Compass },
  { value: 'patrimoine_familial', Icon: Landmark },
  { value: 'hebergement', Icon: Home },
  { value: 'transport', Icon: Bus },
  { value: 'evenement_culturel', Icon: PartyPopper },
  { value: 'service_visiteur_retour', Icon: LifeBuoy },
];

interface DiasporaContentFiltersProps {
  active: DiasporaContentType | undefined;
  onChange: (value: DiasporaContentType | undefined) => void;
  /** Layout vertical pour la sidebar desktop (sinon rangée scrollable mobile/tablette). */
  layout?: 'row' | 'stack';
}

export function DiasporaContentFilters({ active, onChange, layout = 'row' }: DiasporaContentFiltersProps) {
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
              {value ? t(`diaspora.types.${value}`) : t('diaspora.filters.all')}
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
              {value ? t(`diaspora.types.${value}`) : t('diaspora.filters.all')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

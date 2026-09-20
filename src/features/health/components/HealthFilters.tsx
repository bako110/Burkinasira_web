import { useTranslation } from 'react-i18next';
import { LayoutGrid, Pill, Building2, Stethoscope, FlaskConical, Cross, Smile, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

import type { HealthFacilityType } from '../types';
import styles from './HealthFilters.module.css';

const TYPES: { key: string; value: HealthFacilityType | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'pharmacie', value: 'pharmacie', Icon: Pill },
  { key: 'hopital', value: 'hopital', Icon: Building2 },
  { key: 'clinique', value: 'clinique', Icon: Stethoscope },
  { key: 'laboratoire', value: 'laboratoire', Icon: FlaskConical },
  { key: 'centre_premiers_secours', value: 'centre_premiers_secours', Icon: Cross },
  { key: 'dentiste', value: 'dentiste', Icon: Smile },
  { key: 'autre', value: 'autre', Icon: MoreHorizontal },
];

interface HealthFiltersProps {
  active: HealthFacilityType | undefined;
  onChange: (value: HealthFacilityType | undefined) => void;
  layout?: 'row' | 'stack';
}

export function HealthFilters({ active, onChange, layout = 'row' }: HealthFiltersProps) {
  const { t } = useTranslation();

  if (layout === 'stack') {
    return (
      <div className={styles.stack}>
        {TYPES.map(({ key, value, Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={key}
              type="button"
              className={clsx(styles.stackItem, isActive && styles.stackItemActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              <Icon size={16} strokeWidth={2} className={styles.stackIcon} />
              {t(`health.filters.${key}`)}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.scroller}>
      <div className={styles.row}>
        {TYPES.map(({ key, value, Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={key}
              type="button"
              className={clsx(styles.chip, isActive && styles.chipActive)}
              onClick={() => onChange(value)}
              aria-pressed={isActive}
            >
              <Icon size={16} strokeWidth={2} />
              {t(`health.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

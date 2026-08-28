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
}

export function HealthFilters({ active, onChange }: HealthFiltersProps) {
  const { t } = useTranslation();

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

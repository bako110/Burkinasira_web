import { useTranslation } from 'react-i18next';
import { LayoutGrid, Building2, Tent, Warehouse, Home, Building, Users } from 'lucide-react';
import clsx from 'clsx';

import type { AccommodationType } from '../types';
import styles from './HotelFilters.module.css';

const TYPES: { key: string; value: AccommodationType | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'hotel', value: 'hotel', Icon: Building2 },
  { key: 'auberge', value: 'auberge', Icon: Warehouse },
  { key: 'campement', value: 'campement', Icon: Tent },
  { key: 'maison_hotes', value: 'maison_hotes', Icon: Home },
  { key: 'residence', value: 'residence', Icon: Building },
  { key: 'hebergement_habitant', value: 'hebergement_habitant', Icon: Users },
  { key: 'hebergement_communautaire', value: 'hebergement_communautaire', Icon: Users },
];

interface HotelFiltersProps {
  active: AccommodationType | undefined;
  onChange: (value: AccommodationType | undefined) => void;
}

export function HotelFilters({ active, onChange }: HotelFiltersProps) {
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
              {t(`hotels.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

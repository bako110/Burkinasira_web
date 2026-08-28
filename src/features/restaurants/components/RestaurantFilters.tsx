import { useTranslation } from 'react-i18next';
import { LayoutGrid, UtensilsCrossed, Beer, Coffee, Truck, Sparkles } from 'lucide-react';
import clsx from 'clsx';

import type { EstablishmentType } from '../types';
import styles from './RestaurantFilters.module.css';

const TYPES: { key: string; value: EstablishmentType | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'restaurant', value: 'restaurant', Icon: UtensilsCrossed },
  { key: 'maquis', value: 'maquis', Icon: Beer },
  { key: 'cafe', value: 'cafe', Icon: Coffee },
  { key: 'street_food', value: 'street_food', Icon: Truck },
  { key: 'etablissement_touristique', value: 'etablissement_touristique', Icon: Sparkles },
];

interface RestaurantFiltersProps {
  active: EstablishmentType | undefined;
  onChange: (value: EstablishmentType | undefined) => void;
}

export function RestaurantFilters({ active, onChange }: RestaurantFiltersProps) {
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
              {t(`restaurants.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { LayoutGrid, Shirt, Gem, Amphora, Hammer, Palette, Wheat, Apple, Gift } from 'lucide-react';
import clsx from 'clsx';

import type { ProductCategory } from '../types';
import styles from './ProductFilters.module.css';

const CATEGORIES: { key: string; value: ProductCategory | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'tissus_vetements', value: 'tissus_vetements', Icon: Shirt },
  { key: 'bijoux', value: 'bijoux', Icon: Gem },
  { key: 'poterie', value: 'poterie', Icon: Amphora },
  { key: 'sculpture', value: 'sculpture', Icon: Hammer },
  { key: 'objet_art', value: 'objet_art', Icon: Palette },
  { key: 'produit_agricole', value: 'produit_agricole', Icon: Wheat },
  { key: 'produit_alimentaire', value: 'produit_alimentaire', Icon: Apple },
  { key: 'souvenir', value: 'souvenir', Icon: Gift },
];

interface ProductFiltersProps {
  active: ProductCategory | undefined;
  onChange: (value: ProductCategory | undefined) => void;
}

export function ProductFilters({ active, onChange }: ProductFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.scroller}>
      <div className={styles.row}>
        {CATEGORIES.map(({ key, value, Icon }) => {
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
              {t(`market.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

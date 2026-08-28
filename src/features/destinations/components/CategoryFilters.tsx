import { useTranslation } from 'react-i18next';
import {
  LayoutGrid,
  TreePine,
  Landmark,
  Palette,
  Church,
  Building2,
  Pyramid,
  House,
  ShoppingBasket,
  Trees,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

import styles from './CategoryFilters.module.css';

const CATEGORIES = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'site_naturel', value: 'site_naturel', Icon: TreePine },
  { key: 'site_historique', value: 'site_historique', Icon: Landmark },
  { key: 'site_culturel', value: 'site_culturel', Icon: Palette },
  { key: 'site_religieux', value: 'site_religieux', Icon: Church },
  { key: 'musee', value: 'musee', Icon: Building2 },
  { key: 'monument', value: 'monument', Icon: Pyramid },
  { key: 'village_touristique', value: 'village_touristique', Icon: House },
  { key: 'marche_artisanal', value: 'marche_artisanal', Icon: ShoppingBasket },
  { key: 'parc', value: 'parc', Icon: Trees },
  { key: 'autre', value: 'autre', Icon: Sparkles },
] as const;

interface CategoryFiltersProps {
  active: string | undefined;
  onChange: (value: string | undefined) => void;
}

export function CategoryFilters({ active, onChange }: CategoryFiltersProps) {
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
              {t(`explore.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

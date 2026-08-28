import { useTranslation } from 'react-i18next';
import {
  LayoutGrid,
  ScrollText,
  Landmark,
  Sparkles,
  Users,
  Languages,
  BookOpen,
  Music,
  Palette,
  Shirt,
  UtensilsCrossed,
  UserRound,
} from 'lucide-react';
import clsx from 'clsx';

import type { CultureContentType } from '../types';
import styles from './CultureFilters.module.css';

const TYPES: { key: string; value: CultureContentType | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'histoire', value: 'histoire', Icon: ScrollText },
  { key: 'patrimoine_materiel', value: 'patrimoine_materiel', Icon: Landmark },
  { key: 'patrimoine_immateriel', value: 'patrimoine_immateriel', Icon: Sparkles },
  { key: 'tradition', value: 'tradition', Icon: Users },
  { key: 'langue', value: 'langue', Icon: Languages },
  { key: 'conte_legende', value: 'conte_legende', Icon: BookOpen },
  { key: 'musique_danse', value: 'musique_danse', Icon: Music },
  { key: 'artisanat', value: 'artisanat', Icon: Palette },
  { key: 'costume', value: 'costume', Icon: Shirt },
  { key: 'gastronomie', value: 'gastronomie', Icon: UtensilsCrossed },
  { key: 'personnalite', value: 'personnalite', Icon: UserRound },
];

interface CultureFiltersProps {
  active: CultureContentType | undefined;
  onChange: (value: CultureContentType | undefined) => void;
}

export function CultureFilters({ active, onChange }: CultureFiltersProps) {
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
              {t(`culture.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { LayoutGrid, PartyPopper, Music, Store, Palette, Landmark, Trophy, UtensilsCrossed, Sparkles, Presentation, Building2 } from 'lucide-react';
import clsx from 'clsx';

import type { EventCategory } from '../types';
import styles from './EventFilters.module.css';

const CATEGORIES: { key: string; value: EventCategory | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'festival', value: 'festival', Icon: PartyPopper },
  { key: 'concert', value: 'concert', Icon: Music },
  { key: 'foire', value: 'foire', Icon: Store },
  { key: 'exposition', value: 'exposition', Icon: Palette },
  { key: 'culturel', value: 'culturel', Icon: Landmark },
  { key: 'sportif', value: 'sportif', Icon: Trophy },
  { key: 'gastronomique', value: 'gastronomique', Icon: UtensilsCrossed },
  { key: 'ceremonie_traditionnelle', value: 'ceremonie_traditionnelle', Icon: Sparkles },
  { key: 'conference', value: 'conference', Icon: Presentation },
  { key: 'salon', value: 'salon', Icon: Building2 },
];

interface EventFiltersProps {
  active: EventCategory | undefined;
  onChange: (value: EventCategory | undefined) => void;
}

export function EventFilters({ active, onChange }: EventFiltersProps) {
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
              {t(`events.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

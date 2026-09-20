import { useTranslation } from 'react-i18next';
import { LayoutGrid, Landmark, CreditCard, Smartphone, ArrowLeftRight } from 'lucide-react';
import clsx from 'clsx';

import type { MoneyServiceType } from '../types';
import styles from './MoneyFilters.module.css';

const TYPES: { key: string; value: MoneyServiceType | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'banque', value: 'banque', Icon: Landmark },
  { key: 'distributeur', value: 'distributeur', Icon: CreditCard },
  { key: 'mobile_money', value: 'mobile_money', Icon: Smartphone },
  { key: 'bureau_change', value: 'bureau_change', Icon: ArrowLeftRight },
];

interface MoneyFiltersProps {
  active: MoneyServiceType | undefined;
  onChange: (value: MoneyServiceType | undefined) => void;
  /** Layout vertical pour la sidebar desktop (sinon rangée scrollable mobile/tablette). */
  layout?: 'row' | 'stack';
}

export function MoneyFilters({ active, onChange, layout = 'row' }: MoneyFiltersProps) {
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
              <Icon size={17} strokeWidth={2} className={styles.stackIcon} />
              {t(`finance.filters.${key}`)}
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
              {t(`finance.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

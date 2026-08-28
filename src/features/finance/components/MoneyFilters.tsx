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
}

export function MoneyFilters({ active, onChange }: MoneyFiltersProps) {
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
              {t(`finance.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

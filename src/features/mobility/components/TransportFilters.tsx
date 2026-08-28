import { useTranslation } from 'react-i18next';
import { LayoutGrid, Car, UserRound, Bike, Bus, Plane, Compass } from 'lucide-react';
import clsx from 'clsx';

import type { TransportType } from '../types';
import styles from './TransportFilters.module.css';

const TYPES: { key: string; value: TransportType | undefined; Icon: typeof LayoutGrid }[] = [
  { key: 'all', value: undefined, Icon: LayoutGrid },
  { key: 'taxi_vtc', value: 'taxi_vtc', Icon: Car },
  { key: 'chauffeur_prive', value: 'chauffeur_prive', Icon: UserRound },
  { key: 'location_voiture', value: 'location_voiture', Icon: Car },
  { key: 'location_moto', value: 'location_moto', Icon: Bike },
  { key: 'transport_interurbain', value: 'transport_interurbain', Icon: Bus },
  { key: 'transfert_aeroport', value: 'transfert_aeroport', Icon: Plane },
  { key: 'transport_touristique_prive', value: 'transport_touristique_prive', Icon: Compass },
];

interface TransportFiltersProps {
  active: TransportType | undefined;
  onChange: (value: TransportType | undefined) => void;
}

export function TransportFilters({ active, onChange }: TransportFiltersProps) {
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
              {t(`mobility.filters.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

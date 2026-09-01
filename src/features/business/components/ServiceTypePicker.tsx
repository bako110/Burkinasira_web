import { useTranslation } from 'react-i18next';
import { CheckSquare, Square } from 'lucide-react';
import clsx from 'clsx';

import type { BusinessServiceType } from '../types';
import styles from './ServiceTypePicker.module.css';

const TYPES: BusinessServiceType[] = [
  'salle_conference',
  'seminaire',
  'congres',
  'team_building',
  'transport_groupe',
  'restauration_groupe',
  'prestataire_evenementiel',
  'photographie_audiovisuel',
];

interface ServiceTypePickerProps {
  selected: BusinessServiceType[];
  onChange: (value: BusinessServiceType[]) => void;
}

export function ServiceTypePicker({ selected, onChange }: ServiceTypePickerProps) {
  const { t } = useTranslation();

  function toggle(type: BusinessServiceType) {
    if (selected.includes(type)) {
      onChange(selected.filter((v) => v !== type));
    } else {
      onChange([...selected, type]);
    }
  }

  return (
    <div className={styles.grid}>
      {TYPES.map((type) => {
        const isActive = selected.includes(type);
        return (
          <button
            key={type}
            type="button"
            className={clsx(styles.chip, isActive && styles.chipActive)}
            onClick={() => toggle(type)}
            aria-pressed={isActive}
          >
            {isActive ? <CheckSquare size={16} strokeWidth={2} /> : <Square size={16} strokeWidth={2} />}
            {t(`business.serviceTypes.${type}`)}
          </button>
        );
      })}
    </div>
  );
}

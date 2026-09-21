import { useTranslation } from 'react-i18next';
import {
  Presentation,
  Users2,
  Landmark,
  HeartHandshake,
  BusFront,
  UtensilsCrossed,
  PartyPopper,
  Camera,
  Check,
} from 'lucide-react';
import clsx from 'clsx';

import type { BusinessServiceType } from '../types';
import styles from './ServiceTypePicker.module.css';

const TYPES: { key: BusinessServiceType; Icon: typeof Presentation }[] = [
  { key: 'salle_conference', Icon: Presentation },
  { key: 'seminaire', Icon: Users2 },
  { key: 'congres', Icon: Landmark },
  { key: 'team_building', Icon: HeartHandshake },
  { key: 'transport_groupe', Icon: BusFront },
  { key: 'restauration_groupe', Icon: UtensilsCrossed },
  { key: 'prestataire_evenementiel', Icon: PartyPopper },
  { key: 'photographie_audiovisuel', Icon: Camera },
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
      {TYPES.map(({ key, Icon }) => {
        const isActive = selected.includes(key);
        return (
          <button
            key={key}
            type="button"
            className={clsx(styles.card, isActive && styles.cardActive)}
            onClick={() => toggle(key)}
            aria-pressed={isActive}
          >
            {isActive && (
              <span className={styles.checkBadge}>
                <Check size={11} strokeWidth={3} />
              </span>
            )}
            <span className={styles.iconWrap}>
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <span className={styles.cardLabel}>{t(`business.serviceTypes.${key}`)}</span>
          </button>
        );
      })}
    </div>
  );
}

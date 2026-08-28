import { Phone, Shield, Flame, Siren, Cross, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import type { EmergencyContact, EmergencyContactType } from '../types';
import styles from './EmergencyContactCard.module.css';

const ICONS: Record<EmergencyContactType, typeof Shield> = {
  police: Shield,
  pompiers: Flame,
  gendarmerie: Siren,
  samu: Cross,
  autre: MoreHorizontal,
};

export function EmergencyContactCard({ contact }: { contact: EmergencyContact }) {
  const { t } = useTranslation();
  const Icon = ICONS[contact.type] ?? MoreHorizontal;

  return (
    <a href={`tel:${contact.phone_number}`} className={styles.card}>
      <span className={styles.icon}>
        <Icon size={22} strokeWidth={1.75} />
      </span>
      <div className={styles.text}>
        <span className={styles.label}>{contact.label || t(`emergency.types.${contact.type}`)}</span>
        <span className={styles.number}>{contact.phone_number}</span>
      </div>
      <span className={styles.callBtn}>
        <Phone size={16} strokeWidth={2} />
      </span>
    </a>
  );
}

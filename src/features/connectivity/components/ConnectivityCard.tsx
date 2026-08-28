import { Link } from 'react-router-dom';
import { MapPin, Phone, Wifi, Radio, Store, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { ConnectivityPointSummary, ConnectivityPointType } from '../types';
import styles from './ConnectivityCard.module.css';

const ICONS: Record<ConnectivityPointType, typeof Wifi> = {
  operateur_telecom: Radio,
  point_vente_sim: Store,
  wifi_public: Wifi,
  wifi_prive: Wifi,
  coworking: Building,
  boutique_telephonie: Store,
};

export function ConnectivityCard({ point }: { point: ConnectivityPointSummary }) {
  const { t } = useTranslation();
  const Icon = ICONS[point.type] ?? Wifi;
  const location = [point.city, point.region].filter(Boolean).join(', ');

  return (
    <Link to={`/connectivity/${point.id}`} className={styles.link}>
      <Card className={styles.card}>
        <span className={styles.icon}>
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <div className={styles.body}>
          <span className={styles.typeLabel}>{t(`connectivity.types.${point.type}`, point.type)}</span>
          <h3 className={styles.name}>{point.name}</h3>
          {point.operator && <p className={styles.operator}>{point.operator}</p>}
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          <div className={styles.badges}>
            {point.is_free && <span className={styles.badgeFree}>{t('connectivity.free')}</span>}
            {point.offers_esim && <span className={styles.badgeEsim}>{t('connectivity.esim')}</span>}
          </div>
          {point.contact_phone && (
            <span className={styles.phone}>
              <Phone size={13} strokeWidth={2} />
              {point.contact_phone}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

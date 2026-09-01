import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Pill, Building2, Stethoscope, FlaskConical, Cross, Smile, MoreHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { HealthFacilitySummary, HealthFacilityType } from '../types';
import styles from './HealthFacilityCard.module.css';

const ICONS: Record<HealthFacilityType, typeof Pill> = {
  pharmacie: Pill,
  hopital: Building2,
  clinique: Stethoscope,
  laboratoire: FlaskConical,
  centre_premiers_secours: Cross,
  dentiste: Smile,
  autre: MoreHorizontal,
};

export function HealthFacilityCard({ facility }: { facility: HealthFacilitySummary }) {
  const { t } = useTranslation();
  const location = [facility.city, facility.region].filter(Boolean).join(', ');
  const Icon = ICONS[facility.type] ?? MoreHorizontal;

  return (
    <Link to={`/health/${facility.slug}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.banner}>
          <Icon size={28} strokeWidth={1.5} />
          {facility.is_on_duty && (
            <span className={styles.onDutyBadge}>
              <Clock size={12} strokeWidth={2} />
              {t('health.onDuty')}
            </span>
          )}
        </div>
        <div className={styles.body}>
          <span className={styles.typeLabel}>{t(`health.types.${facility.type}`, facility.type)}</span>
          <h3 className={styles.name}>{facility.name}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          {facility.contact_phone && (
            <span className={styles.phone}>
              <Phone size={13} strokeWidth={2} />
              {facility.contact_phone}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

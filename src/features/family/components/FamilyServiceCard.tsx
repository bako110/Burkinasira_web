import { Link } from 'react-router-dom';
import { MapPin, Users2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { FamilyServiceSummary } from '../types';
import styles from './FamilyServiceCard.module.css';

export function FamilyServiceCard({ service }: { service: FamilyServiceSummary }) {
  const { t } = useTranslation();
  const location = [service.city, service.region].filter(Boolean).join(', ');

  return (
    <Link to={`/family/${service.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconWrap}>
          <Users2 size={32} strokeWidth={1.5} />
          <span className={styles.categoryBadge}>{t(`family.types.${service.type}`, service.type)}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{service.name}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

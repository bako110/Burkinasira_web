import { Link } from 'react-router-dom';
import { MapPin, Wrench, Clock3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { RoadServiceSummary } from '../types';
import styles from './RoadServiceCard.module.css';

export function RoadServiceCard({ service }: { service: RoadServiceSummary }) {
  const { t } = useTranslation();
  const location = [service.city, service.region].filter(Boolean).join(', ');

  return (
    <Link to={`/roads/${service.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconWrap}>
          <Wrench size={32} strokeWidth={1.5} />
          <span className={styles.categoryBadge}>{t(`roads.types.${service.type}`, service.type)}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{service.name}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          <div className={styles.footer}>
            {service.offers_24h && (
              <span className={styles.price}>
                <Clock3 size={13} strokeWidth={2} />
                {t('roads.open24h')}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

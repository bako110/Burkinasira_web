import { Link } from 'react-router-dom';
import { MapPin, Users2, PartyPopper, Baby, Trees, BedDouble, ShowerHead, Droplets } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { FamilyServiceSummary, FamilyServiceType } from '../types';
import styles from './FamilyServiceCard.module.css';

const TYPE_ICONS: Record<FamilyServiceType, typeof Users2> = {
  activite_familiale: PartyPopper,
  garde_enfants: Baby,
  aire_jeux: Trees,
  espace_repos: BedDouble,
  sanitaire_public: ShowerHead,
  point_eau: Droplets,
};

export function FamilyServiceCard({ service }: { service: FamilyServiceSummary }) {
  const { t } = useTranslation();
  const location = [service.city, service.region].filter(Boolean).join(', ');
  const Icon = TYPE_ICONS[service.type] ?? Users2;

  return (
    <Link to={`/family/${service.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconWrap}>
          <Icon size={32} strokeWidth={1.5} className={styles.icon} />
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

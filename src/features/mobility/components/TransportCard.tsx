import { Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, Car, Bike, Plane, Bus as BusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { TransportProviderSummary, TransportType } from '../types';
import styles from './TransportCard.module.css';

const TYPE_ICON: Record<TransportType, typeof Car> = {
  taxi_vtc: Car,
  chauffeur_prive: Car,
  location_voiture: Car,
  location_moto: Bike,
  transport_interurbain: BusIcon,
  transfert_aeroport: Plane,
  transport_touristique_prive: BusIcon,
};

export function TransportCard({ provider }: { provider: TransportProviderSummary }) {
  const { t } = useTranslation();
  const location = [provider.city, provider.region].filter(Boolean).join(', ');
  const Icon = TYPE_ICON[provider.type] ?? Car;

  return (
    <Link to={`/mobility/${provider.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconBanner}>
          <Icon size={30} strokeWidth={1.5} />
          {provider.is_verified && (
            <span className={styles.verifiedBadge}>
              <ShieldCheck size={13} strokeWidth={2} />
            </span>
          )}
        </div>
        <div className={styles.body}>
          <span className={styles.typeLabel}>{t(`mobility.types.${provider.type}`, provider.type)}</span>
          <h3 className={styles.name}>{provider.name}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          <div className={styles.footer}>
            {typeof provider.average_rating === 'number' && provider.review_count > 0 && (
              <span className={styles.rating}>
                <Star size={13} strokeWidth={2} fill="currentColor" />
                {provider.average_rating.toFixed(1)}
              </span>
            )}
            {typeof provider.price_estimate === 'number' && (
              <span className={styles.price}>
                {t('mobility.fromPrice', {
                  price: provider.price_estimate.toLocaleString('fr-FR'),
                  currency: provider.price_currency,
                })}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

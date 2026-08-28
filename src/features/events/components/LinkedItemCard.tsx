import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

import styles from './LinkedItemCard.module.css';

interface LinkedItemCardProps {
  to: string;
  name: string;
  location?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
}

export function LinkedItemCard({ to, name, location, price, currency, rating, reviewCount }: LinkedItemCardProps) {
  return (
    <Link to={to} className={styles.card}>
      <span className={styles.name}>{name}</span>
      <div className={styles.meta}>
        {location && (
          <span className={styles.metaItem}>
            <MapPin size={13} strokeWidth={2} />
            {location}
          </span>
        )}
        {typeof rating === 'number' && reviewCount ? (
          <span className={styles.metaItem}>
            <Star size={13} strokeWidth={2} fill="currentColor" />
            {rating.toFixed(1)} ({reviewCount})
          </span>
        ) : null}
      </div>
      {typeof price === 'number' && (
        <span className={styles.price}>
          {price.toLocaleString('fr-FR')} {currency}
        </span>
      )}
    </Link>
  );
}

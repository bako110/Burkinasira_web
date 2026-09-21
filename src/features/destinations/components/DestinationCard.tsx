import { Link } from 'react-router-dom';
import { Star, MapPin, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { Card } from '../../../shared/ui';
import type { Destination } from '../types';
import styles from './DestinationCard.module.css';

interface DestinationCardProps {
  destination: Destination;
  /** 'fill' lets the image grow to fill its container instead of a fixed 4:3
   * ratio — used for the editorial "lead" tile that spans extra grid rows. */
  imageFit?: 'ratio' | 'fill';
}

export function DestinationCard({ destination, imageFit = 'ratio' }: DestinationCardProps) {
  const { t } = useTranslation();
  const cover = destination.photo;
  const location = [destination.city, destination.region].filter(Boolean).join(', ');

  return (
    <Link to={`/explore/${destination.slug}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={clsx(styles.imageWrap, imageFit === 'fill' && styles.imageWrapFill)}>
          {cover ? (
            <img src={cover} alt={destination.name} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
          )}
          {destination.category && (
            <span className={styles.categoryBadge}>{t(`categories.${destination.category}`, destination.category)}</span>
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{destination.name}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          {typeof destination.average_rating === 'number' && (
            <span className={styles.rating}>
              <Star size={13} strokeWidth={2} fill="currentColor" />
              {destination.average_rating.toFixed(1)}
              {typeof destination.review_count === 'number' && destination.review_count > 0 && (
                <span className={styles.reviewCount}>({destination.review_count})</span>
              )}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

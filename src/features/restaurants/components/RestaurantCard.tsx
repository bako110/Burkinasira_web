import { Link } from 'react-router-dom';
import { Star, MapPin, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { RestaurantSummary } from '../types';
import styles from './RestaurantCard.module.css';

export function RestaurantCard({ restaurant }: { restaurant: RestaurantSummary }) {
  const { t } = useTranslation();
  const location = [restaurant.city, restaurant.region].filter(Boolean).join(', ');

  return (
    <Link to={`/restaurants/${restaurant.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.imageWrap}>
          {restaurant.photo ? (
            <img src={restaurant.photo} alt={restaurant.name} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
          )}
          <span className={styles.categoryBadge}>{t(`restaurants.types.${restaurant.type}`, restaurant.type)}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{restaurant.name}</h3>
          {restaurant.cuisine_style && <p className={styles.style}>{restaurant.cuisine_style}</p>}
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          {restaurant.dietary_tags.length > 0 && (
            <div className={styles.tags}>
              {restaurant.dietary_tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {t(`restaurants.dietaryTags.${tag}`, tag)}
                </span>
              ))}
            </div>
          )}
          {typeof restaurant.average_rating === 'number' && (
            <span className={styles.rating}>
              <Star size={13} strokeWidth={2} fill="currentColor" />
              {restaurant.average_rating.toFixed(1)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

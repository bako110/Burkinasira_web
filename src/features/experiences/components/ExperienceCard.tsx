import { Link } from 'react-router-dom';
import { Star, MapPin, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { ExperienceSummary } from '../types';
import styles from './ExperienceCard.module.css';

export function ExperienceCard({ experience }: { experience: ExperienceSummary }) {
  const { t } = useTranslation();
  const location = [experience.city, experience.region].filter(Boolean).join(', ');

  return (
    <Link to={`/experiences/${experience.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.imageWrap}>
          {experience.photo ? (
            <img src={experience.photo} alt={experience.title} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
          )}
          <span className={styles.categoryBadge}>
            {t(`experiences.types.${experience.type}`, experience.type)}
          </span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{experience.title}</h3>
          <p className={styles.host}>{t('experiences.hostedBy', { name: experience.host_name })}</p>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          <div className={styles.footer}>
            {typeof experience.price_amount === 'number' ? (
              <span className={styles.price}>
                {experience.price_amount.toLocaleString('fr-FR')} {experience.price_currency}
              </span>
            ) : (
              <span className={styles.price}>{t('experiences.priceOnRequest')}</span>
            )}
            {experience.review_count > 0 && (
              <span className={styles.rating}>
                <Star size={13} strokeWidth={2} fill="currentColor" />
                {experience.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

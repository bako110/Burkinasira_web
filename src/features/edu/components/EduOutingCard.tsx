import { Link } from 'react-router-dom';
import { MapPin, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { EduOuting } from '../types';
import styles from './EduOutingCard.module.css';

export function EduOutingCard({ outing }: { outing: EduOuting }) {
  const { t } = useTranslation();
  const location = [outing.city, outing.region].filter(Boolean).join(', ');

  return (
    <Link to={`/edu/${outing.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.iconWrap}>
          <GraduationCap size={32} strokeWidth={1.5} />
          <span className={styles.categoryBadge}>{t(`edu.types.${outing.type}`, outing.type)}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{outing.title}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          {outing.target_level && <p className={styles.level}>{outing.target_level}</p>}
          <div className={styles.footer}>
            {typeof outing.price_per_participant === 'number' ? (
              <span className={styles.price}>
                {outing.price_per_participant.toLocaleString('fr-FR')} {outing.currency} / {t('edu.perParticipant')}
              </span>
            ) : (
              <span className={styles.price}>{t('edu.priceOnRequest')}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

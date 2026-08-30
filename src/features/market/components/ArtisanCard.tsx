import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, ShieldCheck, Star, MapPin, RotateCw } from 'lucide-react';

import { Button, Virtual360Viewer } from '../../../shared/ui';
import type { ArtisanSummary } from '../types';
import styles from './ArtisanCard.module.css';

interface ArtisanCardProps {
  artisan: ArtisanSummary;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const { t } = useTranslation();
  const [tourOpen, setTourOpen] = useState(false);
  const location = [artisan.city, artisan.region].filter(Boolean).join(', ');

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        {artisan.photo_url ? (
          <img src={artisan.photo_url} alt={artisan.display_name} />
        ) : (
          <User size={22} strokeWidth={1.5} />
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{artisan.display_name}</span>
          {artisan.is_verified && (
            <span className={styles.verifiedBadge}>
              <ShieldCheck size={13} strokeWidth={2} />
              {t('destinations.verified')}
            </span>
          )}
        </div>
        <div className={styles.metaRow}>
          {location && (
            <span className={styles.metaItem}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </span>
          )}
          {artisan.review_count > 0 && (
            <span className={styles.metaItem}>
              <Star size={13} strokeWidth={2} fill="currentColor" />
              {artisan.average_rating.toFixed(1)} ({artisan.review_count})
            </span>
          )}
        </div>
        {artisan.story && <p className={styles.story}>{artisan.story}</p>}
        {artisan.photos_360.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => setTourOpen(true)}>
            <RotateCw size={14} strokeWidth={2} />
            {t('virtualTour.ctaArtisan')}
          </Button>
        )}
      </div>

      <Virtual360Viewer
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        urls={artisan.photos_360}
        title={t('virtualTour.ctaArtisan')}
      />
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, ShieldCheck, Star, MapPin, Maximize2 } from 'lucide-react';

import { Button, ImmersiveGallery } from '../../../shared/ui';
import type { ArtisanSummary } from '../types';
import styles from './ArtisanCard.module.css';

interface ArtisanCardProps {
  artisan: ArtisanSummary;
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  const { t } = useTranslation();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const location = [artisan.city, artisan.region].filter(Boolean).join(', ');
  const allMedia = [...(artisan.photos ?? []), ...(artisan.videos ?? [])];

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
        {allMedia.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => setGalleryOpen(true)}>
            <Maximize2 size={14} strokeWidth={2} />
            {t('gallery.ctaArtisan')}
          </Button>
        )}
      </div>

      <ImmersiveGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        urls={allMedia}
        title={artisan.display_name}
      />
    </div>
  );
}

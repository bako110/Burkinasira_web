import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ImageOff, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BookingModal } from '../../bookings/components/BookingModal';
import type { HotelSummary } from '../types';
import styles from './HotelCard.module.css';

export function HotelCard({ hotel }: { hotel: HotelSummary }) {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const location = [hotel.city, hotel.region].filter(Boolean).join(', ');
  const canBook = typeof hotel.min_price === 'number';

  function handleBook() {
    requireAuth(() => setModalOpen(true), t('hotels.bookRequiresAuth'));
  }

  return (
    <Card className={styles.card}>
      <Link to={`/hotels/${hotel.id}`} className={styles.link}>
        <div className={styles.imageWrap}>
          {hotel.photo ? (
            <img src={hotel.photo} alt={hotel.name} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
          )}
          <span className={styles.categoryBadge}>{t(`hotels.types.${hotel.type}`, hotel.type)}</span>
          {hotel.is_verified && (
            <span className={styles.verifiedBadge}>
              <ShieldCheck size={13} strokeWidth={2} />
            </span>
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{hotel.name}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          <div className={styles.footer}>
            {typeof hotel.average_rating === 'number' && (
              <span className={styles.rating}>
                <Star size={13} strokeWidth={2} fill="currentColor" />
                {hotel.average_rating.toFixed(1)}
              </span>
            )}
            {typeof hotel.min_price === 'number' && (
              <span className={styles.price}>
                {t('hotels.fromPrice', { price: hotel.min_price.toLocaleString('fr-FR'), currency: hotel.currency })}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className={styles.actionRow}>
        <Button variant="secondary" size="sm" fullWidth onClick={handleBook} disabled={!canBook}>
          {canBook ? t('hotels.book') : t('hotels.priceUnavailable')}
        </Button>
      </div>

      {canBook && (
        <BookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          itemType="hotel"
          itemId={hotel.id}
          itemTitle={hotel.name}
          unitPrice={hotel.min_price!}
          currency={hotel.currency}
          requiresDate
        />
      )}
    </Card>
  );
}

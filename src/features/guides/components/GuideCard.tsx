import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BookingModal } from '../../bookings/components/BookingModal';
import type { GuideSummary } from '../types';
import styles from './GuideCard.module.css';

export function GuideCard({ guide }: { guide: GuideSummary }) {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const canBook = typeof guide.daily_rate === 'number';

  function handleContact() {
    requireAuth(() => setModalOpen(true), t('guides.contactRequiresAuth'));
  }

  return (
    <Card className={styles.card}>
      <Link to={`/guides/${guide.id}`} className={styles.link}>
        <div className={styles.header}>
          <div className={styles.avatarWrap}>
            {guide.photo_url ? (
              <img src={guide.photo_url} alt={guide.display_name} className={styles.avatar} loading="lazy" />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <User size={22} strokeWidth={1.5} />
              </div>
            )}
            {guide.is_verified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={12} strokeWidth={2} />
              </span>
            )}
          </div>
          <div className={styles.headerText}>
            <h3 className={styles.name}>{guide.display_name}</h3>
            {guide.regions_covered.length > 0 && (
              <p className={styles.location}>
                <MapPin size={13} strokeWidth={2} />
                {guide.regions_covered.slice(0, 2).join(', ')}
              </p>
            )}
          </div>
        </div>

        {guide.specialties.length > 0 && (
          <div className={styles.tags}>
            {guide.specialties.slice(0, 3).map((s) => (
              <span key={s} className={styles.tag}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          {typeof guide.average_rating === 'number' && guide.review_count > 0 && (
            <span className={styles.rating}>
              <Star size={13} strokeWidth={2} fill="currentColor" />
              {guide.average_rating.toFixed(1)}
            </span>
          )}
          {typeof guide.daily_rate === 'number' && (
            <span className={styles.price}>
              {t('guides.perDay', { price: guide.daily_rate.toLocaleString('fr-FR'), currency: guide.currency })}
            </span>
          )}
        </div>
      </Link>

      <Button variant="secondary" size="sm" fullWidth onClick={handleContact} disabled={!canBook}>
        {canBook ? t('guides.contact') : t('guides.rateUnavailable')}
      </Button>

      {canBook && (
        <BookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          itemType="guide"
          itemId={guide.id}
          itemTitle={guide.display_name}
          unitPrice={guide.daily_rate!}
          currency={guide.currency}
          requiresDate
        />
      )}
    </Card>
  );
}

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThumbsUp, Star } from 'lucide-react';

import { Button, Spinner, Avatar, Reveal } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useAuthStore } from '../../../store/auth.store';
import { useMyBookings } from '../../bookings/hooks/useMyBookings';
import { useMarkReviewHelpful, useReviewedBookingIds, useReviewsForTarget } from '../hooks';
import type { ReviewTargetType } from '../types';
import { StarRating } from './StarRating';
import { ReviewModal } from './ReviewModal';
import styles from './ReviewsSection.module.css';

interface ReviewsSectionProps {
  targetType: ReviewTargetType;
  targetId: string | undefined;
  /** Nom du lieu/prestataire noté, affiché dans la modale d'avis. */
  itemTitle?: string;
}

export function ReviewsSection({ targetType, targetId, itemTitle }: ReviewsSectionProps) {
  const { t, i18n } = useTranslation();
  const requireAuth = useRequireAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading } = useReviewsForTarget(targetType, targetId);
  const markHelpful = useMarkReviewHelpful();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Une réservation ne peut être notée que si elle correspond à ce lieu précis,
  // est terminée, et n'a pas déjà reçu d'avis.
  const { data: bookings } = useMyBookings('completed');
  const reviewedBookingIds = useReviewedBookingIds();
  const reviewableBooking = useMemo(
    () =>
      bookings?.find(
        (b) => b.item_type === targetType && b.item_id === targetId && !reviewedBookingIds.has(b.id),
      ),
    [bookings, targetType, targetId, reviewedBookingIds],
  );

  function handleLeaveReview() {
    requireAuth(() => setReviewModalOpen(true), t('reviews.leaveReviewRequiresAuth'));
  }

  if (isLoading) {
    return (
      <Reveal as="section" className={styles.section}>
        <span className={styles.sectionKicker}>{t('reviews.sectionKicker')}</span>
        <h2 className={styles.title}>{t('reviews.sectionTitle')}</h2>
        <Spinner size={22} />
      </Reveal>
    );
  }

  const total = data?.total ?? 0;
  const average = data?.average_rating ?? 0;
  const breakdown = data?.rating_breakdown ?? {};
  const maxCount = Math.max(1, ...Object.values(breakdown));

  return (
    <Reveal as="section" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.sectionKicker}>{t('reviews.sectionKicker')}</span>
          <h2 className={styles.title}>{t('reviews.sectionTitle')}</h2>
        </div>
        {reviewableBooking && (
          <Button variant="secondary" size="sm" onClick={handleLeaveReview}>
            <Star size={15} strokeWidth={2} />
            {t('reviews.leaveReview')}
          </Button>
        )}
      </div>

      {!reviewableBooking && (!isAuthenticated || total === 0) && (
        <p className={styles.reviewHint}>
          {isAuthenticated ? t('reviews.needCompletedBooking') : t('reviews.needCompletedBookingLoggedOut')}
        </p>
      )}

      {total === 0 ? (
        <p className={styles.empty}>{t('reviews.none')}</p>
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryScore}>
              <span className={styles.average}>{average.toFixed(1)}</span>
              <StarRating value={average} size={18} />
              <span className={styles.count}>{t('reviews.count', { count: total })}</span>
            </div>
            <div className={styles.breakdown}>
              {[5, 4, 3, 2, 1].map((star) => {
                const c = breakdown[String(star)] ?? 0;
                return (
                  <div key={star} className={styles.breakdownRow}>
                    <span className={styles.breakdownStar}>{star}</span>
                    <span className={styles.breakdownTrack}>
                      <span
                        className={styles.breakdownFill}
                        style={{ width: `${(c / maxCount) * 100}%` }}
                      />
                    </span>
                    <span className={styles.breakdownCount}>{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <ul className={styles.list}>
            {data?.items.map((review) => (
              <li key={review.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <Avatar src={review.author_avatar_url} name={review.author_name} size={34} />
                  <div className={styles.itemMeta}>
                    <span className={styles.author}>
                      {review.author_name ?? t('reviews.anonymous')}
                    </span>
                    <span className={styles.date}>
                      {new Date(review.created_at).toLocaleDateString(i18n.language, {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  <StarRating value={review.rating} size={14} />
                </div>

                {review.comment && <p className={styles.comment}>{review.comment}</p>}

                {review.photos.length > 0 && (
                  <div className={styles.photos}>
                    {review.photos.map((url) => (
                      <span key={url} className={styles.photo}>
                        <img src={url} alt="" />
                      </span>
                    ))}
                  </div>
                )}

                {review.reply_comment && (
                  <div className={styles.reply}>
                    <span className={styles.replyLabel}>{t('reviews.proReply')}</span>
                    <p className={styles.replyText}>{review.reply_comment}</p>
                  </div>
                )}

                <button
                  type="button"
                  className={styles.helpful}
                  onClick={() => markHelpful.mutate(review.id)}
                  disabled={markHelpful.isPending}
                >
                  <ThumbsUp size={13} strokeWidth={2} />
                  {t('reviews.helpful')}
                  {review.helpful_count > 0 && ` (${review.helpful_count})`}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {reviewableBooking && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          bookingId={reviewableBooking.id}
          itemTitle={itemTitle ?? reviewableBooking.item_title}
        />
      )}
    </Reveal>
  );
}

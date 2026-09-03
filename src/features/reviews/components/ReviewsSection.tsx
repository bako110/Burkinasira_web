import { useTranslation } from 'react-i18next';
import { ThumbsUp } from 'lucide-react';

import { Spinner, Avatar } from '../../../shared/ui';
import { useMarkReviewHelpful, useReviewsForTarget } from '../hooks';
import type { ReviewTargetType } from '../types';
import { StarRating } from './StarRating';
import styles from './ReviewsSection.module.css';

interface ReviewsSectionProps {
  targetType: ReviewTargetType;
  targetId: string | undefined;
}

export function ReviewsSection({ targetType, targetId }: ReviewsSectionProps) {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useReviewsForTarget(targetType, targetId);
  const markHelpful = useMarkReviewHelpful();

  if (isLoading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>{t('reviews.sectionTitle')}</h2>
        <Spinner size={22} />
      </section>
    );
  }

  const total = data?.total ?? 0;
  const average = data?.average_rating ?? 0;
  const breakdown = data?.rating_breakdown ?? {};
  const maxCount = Math.max(1, ...Object.values(breakdown));

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t('reviews.sectionTitle')}</h2>

      {total === 0 ? (
        <p className={styles.empty}>{t('reviews.none')}</p>
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryScore}>
              <span className={styles.average}>{average.toFixed(1)}</span>
              <StarRating value={average} size={16} />
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
                      <img key={url} src={url} alt="" className={styles.photo} />
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
    </section>
  );
}

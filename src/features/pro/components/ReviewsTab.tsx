import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';

import { Spinner, EmptyResults } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useMyGuideReviews, useReplyToReview } from '../hooks/useGuideReviews';
import styles from './ReviewsTab.module.css';

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'flex', gap: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} strokeWidth={2} fill={i < rating ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}

function ReplyForm({ reviewId }: { reviewId: string }) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const replyMutation = useReplyToReview();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    replyMutation.mutate(
      { reviewId, payload: { reply_comment: text } },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('pro.replySent') });
          setOpen(false);
          setText('');
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  if (!open) {
    return (
      <button type="button" className={styles.replyButton} onClick={() => setOpen(true)}>
        {t('pro.replyToReview')}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.replyForm}>
      <textarea
        className={styles.replyInput}
        rows={2}
        required
        placeholder={t('pro.replyPlaceholder')}
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <button type="submit" className={styles.replyButton} disabled={replyMutation.isPending}>
        {replyMutation.isPending ? t('common.loading') : t('pro.sendReply')}
      </button>
    </form>
  );
}

export function ReviewsTab() {
  const { t } = useTranslation();
  const { data, isLoading } = useMyGuideReviews();

  const breakdown = data?.rating_breakdown ?? { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  const maxCount = Math.max(1, ...Object.values(breakdown));

  return (
    <div className={styles.container}>
      {isLoading && <Spinner size={22} />}

      {!isLoading && data && data.total === 0 && (
        <EmptyResults variant="empty" title={t('pro.noReviews')} text={t('pro.noReviewsDesc')} />
      )}

      {!isLoading && data && data.total > 0 && (
        <>
          <div className={styles.summary}>
            <div className={styles.averageBlock}>
              <span className={styles.averageValue}>{data.average_rating.toFixed(1)}</span>
              <Stars rating={Math.round(data.average_rating)} size={16} />
              <span className={styles.averageCount}>
                {t('pro.reviewCount', { count: data.total })}
              </span>
            </div>
            <div className={styles.breakdown}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = breakdown[String(star)] ?? 0;
                return (
                  <div key={star} className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>{star}</span>
                    <div className={styles.breakdownBar}>
                      <div
                        className={styles.breakdownFill}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                    <span className={styles.breakdownCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.reviewList}>
            {data.items.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span className={styles.authorName}>{review.author_name ?? t('pro.anonymousAuthor')}</span>
                  <span className={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <Stars rating={review.rating} />
                {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}

                {review.reply_comment ? (
                  <div className={styles.replyBox}>
                    <div className={styles.replyLabel}>{t('pro.yourReply')}</div>
                    <div className={styles.replyText}>{review.reply_comment}</div>
                  </div>
                ) : (
                  <ReplyForm reviewId={review.id} />
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

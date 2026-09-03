import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useMyBookings } from '../hooks/useMyBookings';
import { useCancelBooking } from '../hooks/useCancelBooking';
import { BookingCard } from '../components/BookingCard';
import { CancelBookingDialog } from '../components/CancelBookingDialog';
import { ReviewModal, useReviewedBookingIds } from '../../reviews';
import type { Booking } from '../types';
import styles from './MyBookingsPage.module.css';

export function MyBookingsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyBookings();
  const { mutate: cancel, isPending: isCancelling } = useCancelBooking();
  const push = useToastStore((s) => s.push);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToReview, setBookingToReview] = useState<Booking | null>(null);
  const reviewedBookingIds = useReviewedBookingIds();

  function handleConfirmCancel() {
    if (!bookingToCancel) return;
    cancel(
      { bookingId: bookingToCancel.id },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('bookings.cancelSuccess') });
          setBookingToCancel(null);
        },
        onError: (error) => {
          push({ variant: 'error', message: extractApiErrorMessage(error, t('common.error')) });
        },
      },
    );
  }

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('bookings.title')}</h1>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('bookings.empty')} text={t('bookings.emptyText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((booking, i) => (
            <Reveal key={booking.id} delay={Math.min(i, 8) * 50}>
              <BookingCard
                booking={booking}
                onCancel={setBookingToCancel}
                isCancelling={isCancelling}
                onReview={setBookingToReview}
                hasReview={reviewedBookingIds.has(booking.id)}
              />
            </Reveal>
          ))}
        </div>
      )}

      <CancelBookingDialog
        booking={bookingToCancel}
        isPending={isCancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setBookingToCancel(null)}
      />

      {bookingToReview && (
        <ReviewModal
          open
          onClose={() => setBookingToReview(null)}
          bookingId={bookingToReview.id}
          itemTitle={bookingToReview.item_title}
        />
      )}
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { Calendar, FileText } from 'lucide-react';
import clsx from 'clsx';

import { Card, Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyChildcareBookings } from '../hooks/useMyChildcareBookings';
import styles from './MyChildcareBookingsPage.module.css';

export function MyChildcareBookingsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyChildcareBookings();

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('family.myChildcareBookings')}</h1>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('family.myChildcareBookingsEmpty')} text={t('bookings.emptyText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((booking, i) => (
            <Reveal key={booking.id} delay={Math.min(i, 8) * 50}>
              <Card className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={clsx(styles.statusBadge, styles[`status_${booking.status}`])}>
                    {t(`family.bookingStatus.${booking.status}`)}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <Calendar size={14} strokeWidth={2} />
                  <span>{new Date(booking.requested_date).toLocaleString('fr-FR')}</span>
                </div>
                {booking.notes && (
                  <div className={styles.cardRow}>
                    <FileText size={14} strokeWidth={2} />
                    <span>{booking.notes}</span>
                  </div>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

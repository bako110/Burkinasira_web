import { useTranslation } from 'react-i18next';
import { Users, Calendar } from 'lucide-react';
import clsx from 'clsx';

import { Card, Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyEduBookings } from '../hooks/useMyEduBookings';
import styles from './MyEduBookingsPage.module.css';

export function MyEduBookingsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyEduBookings();

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('edu.myBookings')}</h1>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('edu.myBookingsEmpty')} text={t('bookings.emptyText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((booking, i) => (
            <Reveal key={booking.id} delay={Math.min(i, 8) * 50}>
              <Card className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.groupName}>{booking.group_name}</h3>
                  <span className={clsx(styles.statusBadge, styles[`status_${booking.status}`])}>
                    {t(`edu.bookingStatus.${booking.status}`)}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <Users size={14} strokeWidth={2} />
                  <span>{t('edu.participantCountValue', { count: booking.participant_count })}</span>
                </div>
                <div className={styles.cardRow}>
                  <Calendar size={14} strokeWidth={2} />
                  <span>{new Date(booking.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

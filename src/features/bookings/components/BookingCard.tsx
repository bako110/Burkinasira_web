import { useTranslation } from 'react-i18next';
import { QrCode, Calendar } from 'lucide-react';
import clsx from 'clsx';

import { Card, Button } from '../../../shared/ui';
import type { Booking } from '../types';
import styles from './BookingCard.module.css';

const STATUS_TONE: Record<Booking['status'], string> = {
  pending: 'tonePending',
  confirmed: 'toneConfirmed',
  cancelled: 'toneCancelled',
  completed: 'toneCompleted',
  refunded: 'toneRefunded',
};

interface BookingCardProps {
  booking: Booking;
  onCancel?: (booking: Booking) => void;
  isCancelling?: boolean;
}

export function BookingCard({ booking, onCancel, isCancelling }: BookingCardProps) {
  const { t, i18n } = useTranslation();
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <span className={styles.itemType}>{t(`bookings.itemTypes.${booking.item_type}`)}</span>
        <span className={clsx(styles.status, styles[STATUS_TONE[booking.status]])}>
          {t(`bookings.status.${booking.status}`)}
        </span>
      </div>

      <h3 className={styles.title}>{booking.item_title}</h3>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <QrCode size={14} strokeWidth={2} />
          {booking.booking_reference}
        </span>
        {booking.scheduled_date && (
          <span className={styles.metaItem}>
            <Calendar size={14} strokeWidth={2} />
            {new Date(booking.scheduled_date).toLocaleDateString(i18n.language)}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.price}>
          {booking.total_price.toLocaleString('fr-FR')} {booking.currency}
        </span>
        {canCancel && onCancel && (
          <Button variant="ghost" size="sm" onClick={() => onCancel(booking)} disabled={isCancelling}>
            {t('bookings.cancel')}
          </Button>
        )}
      </div>
    </Card>
  );
}

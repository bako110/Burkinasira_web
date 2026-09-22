import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Phone, CheckCircle2, FileDown } from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useConfirmBooking, useMyGuideBookings, useReceivedBookings } from '../hooks/useGuideBookings';
import type { BookingStatus, ProviderItemType } from '../types';
import { generateBookingsPdf } from '../bookingsPdf';
import styles from './BookingsTab.module.css';

const ITEM_TYPE_LABEL_KEY: Record<ProviderItemType, string> = {
  hotel: 'nav.hotels',
  restaurant: 'nav.restaurants',
  transport: 'nav.mobility',
  product: 'nav.market',
};

const STATUS_FILTERS: { value: BookingStatus | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'pro.filterAll' },
  { value: 'pending', labelKey: 'pro.filterPending' },
  { value: 'confirmed', labelKey: 'pro.filterConfirmed' },
  { value: 'completed', labelKey: 'pro.filterCompleted' },
  { value: 'cancelled', labelKey: 'pro.filterCancelled' },
];

const BADGE_CLASS: Record<BookingStatus, string> = {
  pending: styles.badgePending,
  confirmed: styles.badgeConfirmed,
  cancelled: styles.badgeCancelled,
  completed: styles.badgeCompleted,
  refunded: styles.badgeRefunded,
};

interface BookingsTabProps {
  source?: { itemType: ProviderItemType; itemId: string | undefined };
  establishmentName?: string;
  logoUrl?: string;
}

function useBookingsSource(filter: BookingStatus | 'all', source?: BookingsTabProps['source']) {
  const statusFilter = filter === 'all' ? undefined : filter;
  const guideQuery = useMyGuideBookings(statusFilter);
  const providerQuery = useReceivedBookings(source?.itemType ?? 'hotel', source?.itemId, statusFilter);
  return source ? providerQuery : guideQuery;
}

export function BookingsTab({ source, establishmentName, logoUrl }: BookingsTabProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const { data: bookings, isLoading } = useBookingsSource(filter, source);
  const confirmBooking = useConfirmBooking();

  function handleConfirm(bookingId: string) {
    confirmBooking.mutate(bookingId, {
      onSuccess: () => push({ variant: 'success', message: t('pro.bookingConfirmed') }),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  async function handleExportPdf() {
    if (!bookings || !establishmentName || !source) return;
    setIsExporting(true);
    try {
      await generateBookingsPdf({
        establishmentName,
        establishmentTypeLabel: t(ITEM_TYPE_LABEL_KEY[source.itemType]),
        logoUrl,
        bookings,
        labels: {
          documentTitle: t('pro.pdfDocumentTitle'),
          generatedOn: `${t('pro.pdfGeneratedOn')} ${new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}`,
          documentRef: t('pro.pdfDocumentRef'),
          authenticityNotice: t('pro.pdfAuthenticityNotice'),
          columnCustomer: t('pro.pdfColumnCustomer'),
          columnReference: t('pro.pdfColumnReference'),
          columnDate: t('pro.pdfColumnDate'),
          columnAmount: t('pro.pdfColumnAmount'),
          columnStatus: t('pro.pdfColumnStatus'),
          totalBookings: t('pro.pdfTotalBookings'),
          statusLabels: {
            pending: t('pro.bookingStatus_pending'),
            confirmed: t('pro.bookingStatus_confirmed'),
            cancelled: t('pro.bookingStatus_cancelled'),
            completed: t('pro.bookingStatus_completed'),
            refunded: t('pro.bookingStatus_refunded'),
          },
          unknownCustomer: t('pro.unknownCustomer'),
          noBookings: t('pro.noBookings'),
        },
      });
      push({ variant: 'success', message: t('pro.exportPdfSuccess') });
    } catch {
      push({ variant: 'error', message: t('pro.exportPdfError') });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={clsx(styles.filterButton, filter === f.value && styles.filterButtonActive)}
              onClick={() => setFilter(f.value)}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        {establishmentName && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting || !bookings || bookings.length === 0}
          >
            <FileDown size={15} strokeWidth={2} />
            {isExporting ? t('pro.exportPdfGenerating') : t('pro.exportPdf')}
          </Button>
        )}
      </div>

      {isLoading && <Spinner size={22} />}

      {!isLoading && bookings && bookings.length === 0 && (
        <EmptyResults variant="empty" title={t('pro.noBookings')} text={t('pro.noBookingsDesc')} />
      )}

      {!isLoading && bookings && bookings.length > 0 && (
        <div className={styles.list}>
          {bookings.map((booking) => (
            <div key={booking.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.customerName}>{booking.customer_name ?? t('pro.unknownCustomer')}</div>
                  <div className={styles.reference}>{booking.booking_reference}</div>
                </div>
                <span className={`${styles.badge} ${BADGE_CLASS[booking.status]}`}>
                  {t(`pro.bookingStatus_${booking.status}`)}
                </span>
              </div>

              <div className={styles.details}>
                {booking.scheduled_date && (
                  <span className={styles.detailItem}>
                    <Calendar size={13} strokeWidth={2} />
                    {new Date(booking.scheduled_date).toLocaleDateString()}
                  </span>
                )}
                {booking.customer_phone && (
                  <span className={styles.detailItem}>
                    <Phone size={13} strokeWidth={2} />
                    {booking.customer_phone}
                  </span>
                )}
                <span className={styles.price}>
                  {booking.total_price.toLocaleString('fr-FR')} {booking.currency}
                </span>
              </div>

              {booking.status === 'pending' && (
                <Button size="sm" onClick={() => handleConfirm(booking.id)} disabled={confirmBooking.isPending}>
                  <CheckCircle2 size={15} strokeWidth={2} />
                  {t('pro.confirmBooking')}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

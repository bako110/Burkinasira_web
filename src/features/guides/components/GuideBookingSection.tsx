import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, CheckCircle2, MessageCircle } from 'lucide-react';

import { Button, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useCreateBooking } from '../../bookings/hooks/useCreateBooking';
import type { GuideDetail, AvailabilitySlot } from '../types';
import { useGuideAvailableSlots } from '../hooks/useGuideAvailableSlots';
import { useContactGuideAboutSlot } from '../hooks/useContactGuideAboutSlot';
import { SlotCalendarPicker } from './SlotCalendarPicker';
import { computeSlotDurationHours, formatDurationHours } from '../utils/slotDuration';
import styles from './GuideBookingSection.module.css';

interface GuideBookingSectionProps {
  guide: GuideDetail;
}

export function GuideBookingSection({ guide }: GuideBookingSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const push = useToastStore((s) => s.push);

  const { data: slots, isLoading: slotsLoading } = useGuideAvailableSlots(guide.id);
  const contactAboutSlot = useContactGuideAboutSlot();
  const createBooking = useCreateBooking();

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [contactingSlotId, setContactingSlotId] = useState<string | null>(null);

  const sortedSlots = [...(slots ?? [])].sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time));
  const hasHourlyRate = typeof guide.hourly_rate === 'number';
  const durationHours = selectedSlot ? computeSlotDurationHours(selectedSlot.start_time, selectedSlot.end_time) : 0;
  const estimatedPrice = hasHourlyRate ? guide.hourly_rate! * durationHours : guide.daily_rate;

  function handleContactAboutSlot(slotId: string) {
    requireAuth(() => {
      setContactingSlotId(slotId);
      contactAboutSlot.mutate(slotId, {
        onSuccess: (conversation) => {
          navigate(`/messages?conversation=${conversation.id}`);
        },
        onError: (err) => {
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
          setContactingSlotId(null);
        },
      });
    }, t('guides.contactRequiresAuth'));
  }

  function handleReserve() {
    if (!selectedSlot) return;
    requireAuth(() => {
      createBooking.mutate(
        {
          item_type: 'guide',
          item_id: guide.id,
          item_title: guide.display_name,
          unit_price: estimatedPrice ?? 0,
          currency: guide.currency,
          slot_id: selectedSlot.id,
        },
        {
          onSuccess: () => {
            push({ variant: 'success', message: t('bookings.successTitle') });
            setSelectedSlot(null);
          },
          onError: (err) => {
            push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
          },
        },
      );
    }, t('guides.contactRequiresAuth'));
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <CalendarDays size={18} strokeWidth={2} />
        {t('guides.availableSlots')}
      </h2>

      {typeof guide.daily_rate === 'number' && (
        <p className={styles.priceInfo}>
          {t('guides.perDay', { price: guide.daily_rate.toLocaleString('fr-FR'), currency: guide.currency })}
          {hasHourlyRate && (
            <span className={styles.priceInfoSecondary}>
              {' '}
              · {guide.hourly_rate!.toLocaleString('fr-FR')} {guide.currency} / {t('guides.hour')}
            </span>
          )}
        </p>
      )}

      {slotsLoading && <Spinner size={20} />}

      {!slotsLoading && (
        <SlotCalendarPicker slots={sortedSlots} selectedSlotId={selectedSlot?.id ?? null} onSelectSlot={setSelectedSlot} />
      )}

      {selectedSlot && (
        <div className={styles.summaryCard}>
          <p className={styles.summaryTitle}>{t('bookings.summaryTitle')}</p>
          <div className={styles.summaryRow}>
            <span>{t('bookings.summaryDate')}</span>
            <strong>{selectedSlot.date}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('bookings.summaryTime')}</span>
            <strong>
              {selectedSlot.start_time} - {selectedSlot.end_time}
            </strong>
          </div>
          <div className={styles.summaryRow}>
            <span>{t('bookings.summaryDuration')}</span>
            <strong>{formatDurationHours(durationHours)}</strong>
          </div>
          {typeof estimatedPrice === 'number' && (
            <div className={styles.summaryRow}>
              <span>{t('bookings.total')}</span>
              <strong>
                {estimatedPrice.toLocaleString('fr-FR')} {guide.currency}
              </strong>
            </div>
          )}

          <div className={styles.summaryActions}>
            <button
              type="button"
              className={styles.slotContactBtn}
              onClick={() => handleContactAboutSlot(selectedSlot.id)}
              disabled={contactAboutSlot.isPending && contactingSlotId === selectedSlot.id}
            >
              <MessageCircle size={14} strokeWidth={2} />
              {t('guides.contactAboutSlot')}
            </button>
            <Button fullWidth onClick={handleReserve} disabled={createBooking.isPending}>
              {createBooking.isPending ? t('common.loading') : t('bookings.reserveSlot')}
            </Button>
          </div>
        </div>
      )}

      {createBooking.isSuccess && (
        <div className={styles.successBanner}>
          <CheckCircle2 size={18} strokeWidth={2} />
          {t('bookings.successText')}
        </div>
      )}
    </section>
  );
}

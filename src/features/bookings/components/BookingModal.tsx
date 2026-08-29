import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

import { Modal, Button, Input } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateBooking } from '../hooks/useCreateBooking';
import type { BookingItemType } from '../types';
import type { AvailabilitySlot } from '../../guides/types';
import styles from './BookingModal.module.css';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  itemType: BookingItemType;
  itemId: string;
  itemTitle: string;
  unitPrice: number;
  currency?: string;
  requiresDate?: boolean;
  /** Créneaux publiés par le prestataire (item_type="guide") : si fournis,
   * remplace le champ date libre par un choix parmi ces créneaux réels. */
  slots?: AvailabilitySlot[];
}

export function BookingModal({
  open,
  onClose,
  itemType,
  itemId,
  itemTitle,
  unitPrice,
  currency = 'XOF',
  requiresDate = false,
  slots,
}: BookingModalProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess, error, reset } = useCreateBooking();
  const [quantity, setQuantity] = useState(1);
  const [scheduledDate, setScheduledDate] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');

  const hasSlots = Boolean(slots && slots.length > 0);

  function handleClose() {
    reset();
    setQuantity(1);
    setScheduledDate('');
    setSelectedSlotId('');
    onClose();
  }

  function handleSubmit() {
    mutate({
      item_type: itemType,
      item_id: itemId,
      item_title: itemTitle,
      quantity,
      unit_price: unitPrice,
      currency,
      scheduled_date: !hasSlots && scheduledDate ? new Date(scheduledDate).toISOString() : undefined,
      slot_id: hasSlots ? selectedSlotId : undefined,
    });
  }

  const total = unitPrice * quantity;

  return (
    <Modal open={open} onClose={handleClose} title={t('bookings.modalTitle')}>
      {isSuccess ? (
        <div className={styles.success}>
          <CheckCircle2 size={40} strokeWidth={1.5} className={styles.successIcon} />
          <p className={styles.successTitle}>{t('bookings.successTitle')}</p>
          <p className={styles.successText}>{t('bookings.successText')}</p>
          <Button fullWidth onClick={handleClose}>
            {t('common.back')}
          </Button>
        </div>
      ) : (
        <div className={styles.form}>
          <p className={styles.itemName}>{itemTitle}</p>

          {hasSlots ? (
            <div className={styles.slotField}>
              <span className={styles.quantityLabel}>{t('bookings.chooseSlot')}</span>
              <div className={styles.slotList}>
                {slots!.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`${styles.slotOption} ${selectedSlotId === slot.id ? styles.slotOptionSelected : ''}`}
                    onClick={() => setSelectedSlotId(slot.id)}
                  >
                    <span className={styles.slotOptionDate}>{slot.date}</span>
                    <span className={styles.slotOptionTime}>
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            requiresDate && (
              <Input
                type="date"
                label={t('bookings.date')}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            )
          )}

          <div className={styles.quantityRow}>
            <span className={styles.quantityLabel}>{t('bookings.quantity')}</span>
            <div className={styles.quantityControls}>
              <button
                type="button"
                className={styles.quantityBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button type="button" className={styles.quantityBtn} onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <div className={styles.totalRow}>
            <span>{t('bookings.total')}</span>
            <strong>
              {total.toLocaleString('fr-FR')} {currency}
            </strong>
          </div>

          {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}

          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={isPending || (hasSlots ? !selectedSlotId : requiresDate && !scheduledDate)}
          >
            {isPending ? t('common.loading') : t('bookings.confirm')}
          </Button>
        </div>
      )}
    </Modal>
  );
}

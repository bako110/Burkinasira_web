import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

import { Modal, Button, Input } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { RESERVATIONS_ENABLED } from '../../../shared/config/features';
import { BookingUnavailable } from '../../bookings/components/BookingUnavailable';
import { useBookChildcare } from '../hooks/useBookChildcare';
import styles from './BookChildcareModal.module.css';

interface BookChildcareModalProps {
  serviceId: string;
  open: boolean;
  onClose: () => void;
}

export function BookChildcareModal({ serviceId, open, onClose }: BookChildcareModalProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess, error, reset } = useBookChildcare();
  const [requestedDate, setRequestedDate] = useState('');
  const [notes, setNotes] = useState('');

  function handleClose() {
    onClose();
    setRequestedDate('');
    setNotes('');
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({
      service_id: serviceId,
      requested_date: new Date(requestedDate).toISOString(),
      notes: notes.trim() || undefined,
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('family.bookChildcareTitle')}>
      {!RESERVATIONS_ENABLED ? (
        <BookingUnavailable onClose={handleClose} />
      ) : isSuccess ? (
        <div className={styles.success}>
          <CheckCircle2 size={32} strokeWidth={1.5} className={styles.successIcon} />
          <p>{t('family.bookChildcareSuccessText')}</p>
          <Button fullWidth onClick={handleClose}>
            {t('common.back')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.hint}>{t('family.bookChildcareHint')}</p>
          <Input
            label={t('family.requestedDate')}
            type="datetime-local"
            value={requestedDate}
            onChange={(e) => setRequestedDate(e.target.value)}
            required
            autoFocus
          />
          <Input
            label={t('family.notesOptional')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}
          <Button type="submit" fullWidth disabled={isPending || !requestedDate}>
            {isPending ? t('common.loading') : t('family.confirmChildcareBooking')}
          </Button>
        </form>
      )}
    </Modal>
  );
}

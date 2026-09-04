import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

import { Modal, Button, Input } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { RESERVATIONS_ENABLED } from '../../../shared/config/features';
import { BookingUnavailable } from '../../bookings/components/BookingUnavailable';
import { useBookEduOuting } from '../hooks/useBookEduOuting';
import styles from './BookOutingModal.module.css';

interface BookOutingModalProps {
  outingId: string;
  open: boolean;
  onClose: () => void;
}

export function BookOutingModal({ outingId, open, onClose }: BookOutingModalProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess, error, reset } = useBookEduOuting();
  const [groupName, setGroupName] = useState('');
  const [participantCount, setParticipantCount] = useState('');

  function handleClose() {
    onClose();
    setGroupName('');
    setParticipantCount('');
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({
      outing_id: outingId,
      group_name: groupName,
      participant_count: Number(participantCount),
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('edu.bookTitle')}>
      {!RESERVATIONS_ENABLED ? (
        <BookingUnavailable onClose={handleClose} />
      ) : isSuccess ? (
        <div className={styles.success}>
          <CheckCircle2 size={32} strokeWidth={1.5} className={styles.successIcon} />
          <p>{t('edu.bookSuccessText')}</p>
          <Button fullWidth onClick={handleClose}>
            {t('common.back')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.hint}>{t('edu.bookHint')}</p>
          <Input
            label={t('edu.groupName')}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            minLength={2}
            required
            autoFocus
          />
          <Input
            label={t('edu.participantCount')}
            type="number"
            min={1}
            value={participantCount}
            onChange={(e) => setParticipantCount(e.target.value)}
            required
          />
          {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}
          <Button
            type="submit"
            fullWidth
            disabled={isPending || groupName.trim().length < 2 || !participantCount || Number(participantCount) <= 0}
          >
            {isPending ? t('common.loading') : t('edu.confirmBooking')}
          </Button>
        </form>
      )}
    </Modal>
  );
}

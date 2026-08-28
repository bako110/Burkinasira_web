import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

import { Modal, Button } from '../../../shared/ui';
import type { Booking } from '../types';
import styles from './CancelBookingDialog.module.css';

interface CancelBookingDialogProps {
  booking: Booking | null;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function CancelBookingDialog({ booking, isPending, onConfirm, onClose }: CancelBookingDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal open={Boolean(booking)} onClose={onClose} title={t('bookings.cancelConfirmTitle')}>
      <div className={styles.content}>
        <span className={styles.icon}>
          <AlertTriangle size={28} strokeWidth={1.75} />
        </span>
        <p className={styles.text}>
          {t('bookings.cancelConfirmText', { name: booking?.item_title ?? '' })}
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={isPending}>
            {t('bookings.keepBooking')}
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm} disabled={isPending}>
            {isPending ? t('common.loading') : t('bookings.cancelConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

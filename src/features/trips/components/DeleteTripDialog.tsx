import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

import { Modal, Button } from '../../../shared/ui';
import styles from './DeleteTripDialog.module.css';

interface DeleteTripDialogProps {
  open: boolean;
  tripTitle: string;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteTripDialog({ open, tripTitle, isPending, onConfirm, onClose }: DeleteTripDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('trips.deleteConfirmTitle')}>
      <div className={styles.content}>
        <span className={styles.icon}>
          <AlertTriangle size={28} strokeWidth={1.75} />
        </span>
        <p className={styles.text}>{t('trips.deleteConfirmText', { title: tripTitle })}</p>
        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm} disabled={isPending}>
            {isPending ? t('common.loading') : t('trips.deleteConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';

import { Modal, Button } from '../../../shared/ui';
import styles from './DeleteAccountDialog.module.css';

interface DeleteAccountDialogProps {
  open: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteAccountDialog({ open, isPending, onConfirm, onClose }: DeleteAccountDialogProps) {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t('profile.deleteConfirmTitle')}>
      <div className={styles.content}>
        <span className={styles.icon}>
          <AlertTriangle size={28} strokeWidth={1.75} />
        </span>
        <p className={styles.text}>{t('profile.deleteConfirmText')}</p>
        <div className={styles.actions}>
          <Button variant="secondary" fullWidth onClick={onClose} disabled={isPending}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm} disabled={isPending}>
            {isPending ? t('common.loading') : t('profile.deleteConfirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

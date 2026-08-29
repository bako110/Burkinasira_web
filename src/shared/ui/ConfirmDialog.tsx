import { Modal } from './Modal';
import { Button } from './Button';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel} fullWidth>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          fullWidth
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

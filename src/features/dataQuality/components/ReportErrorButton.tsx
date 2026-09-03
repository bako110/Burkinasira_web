import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

import { Modal, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useReportDataError } from '../hooks/useReportDataError';
import styles from './ReportErrorButton.module.css';

interface ReportErrorButtonProps {
  itemType: string;
  itemId: string;
  className?: string;
}

export function ReportErrorButton({ itemType, itemId, className }: ReportErrorButtonProps) {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, isSuccess, error, reset } = useReportDataError();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');

  function handleOpen() {
    requireAuth(() => setOpen(true), t('dataQuality.reportRequiresAuth'));
  }

  function handleClose() {
    setOpen(false);
    setDescription('');
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      { item_type: itemType, item_id: itemId, description },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('dataQuality.reportSuccess') });
        },
      },
    );
  }

  return (
    <>
      <button type="button" className={clsx(styles.trigger, className)} onClick={handleOpen}>
        <Flag size={14} strokeWidth={2} />
        {t('dataQuality.reportError')}
      </button>

      <Modal open={open} onClose={handleClose} title={t('dataQuality.reportTitle')}>
        {isSuccess ? (
          <div className={styles.success}>
            <CheckCircle2 size={32} strokeWidth={1.5} className={styles.successIcon} />
            <p>{t('dataQuality.reportSuccessText')}</p>
            <Button fullWidth onClick={handleClose}>
              {t('common.back')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.hint}>{t('dataQuality.reportHint')}</p>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('dataQuality.descriptionPlaceholder')}
              rows={4}
              minLength={5}
              required
              autoFocus
            />
            {error && (
              <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>
            )}
            <Button type="submit" fullWidth disabled={isPending || description.trim().length < 5}>
              {isPending ? t('common.loading') : t('dataQuality.submitReport')}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}

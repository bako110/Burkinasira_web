import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, LocateFixed } from 'lucide-react';

import { Modal, Button } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useReportBreakdown } from '../hooks/useReportBreakdown';
import { useGeolocation } from '../hooks/useGeolocation';
import styles from './ReportBreakdownModal.module.css';

interface ReportBreakdownModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReportBreakdownModal({ open, onClose }: ReportBreakdownModalProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess, error, reset } = useReportBreakdown();
  const { coords, error: geoError, isLocating, locate } = useGeolocation();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleClose() {
    onClose();
    setDescription('');
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!coords) return;
    mutate({ location: coords, description: description.trim() || undefined });
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('roads.reportBreakdownTitle')}>
      {isSuccess ? (
        <div className={styles.success}>
          <CheckCircle2 size={32} strokeWidth={1.5} className={styles.successIcon} />
          <p>{t('roads.reportBreakdownSuccessText')}</p>
          <Button fullWidth onClick={handleClose}>
            {t('common.back')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.hint}>{t('roads.reportBreakdownHint')}</p>

          <div className={styles.locationRow}>
            <LocateFixed size={16} strokeWidth={2} />
            {isLocating && <span>{t('roads.locating')}</span>}
            {!isLocating && coords && <span>{t('roads.locationFound')}</span>}
            {!isLocating && !coords && (
              <span>{geoError ? t('roads.locationDenied') : t('roads.locationUnknown')}</span>
            )}
            {!isLocating && !coords && (
              <Button type="button" variant="secondary" onClick={locate}>
                {t('roads.retryLocation')}
              </Button>
            )}
          </div>

          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('roads.breakdownDescriptionPlaceholder')}
            rows={4}
          />

          {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}

          <Button type="submit" fullWidth disabled={isPending || !coords}>
            {isPending ? t('common.loading') : t('roads.submitBreakdown')}
          </Button>
        </form>
      )}
    </Modal>
  );
}

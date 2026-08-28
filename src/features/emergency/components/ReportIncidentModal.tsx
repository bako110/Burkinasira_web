import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useReportIncident } from '../hooks/useReportIncident';
import styles from './ReportIncidentModal.module.css';

interface ReportIncidentModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReportIncidentModal({ open, onClose }: ReportIncidentModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useReportIncident();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sent, setSent] = useState(false);

  function handleClose() {
    setTitle('');
    setDescription('');
    setSent(false);
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    function submit(location?: { latitude: number; longitude: number }) {
      mutate(
        { title, description, location },
        {
          onSuccess: () => {
            setSent(true);
            push({ variant: 'success', message: t('emergency.incidentSuccess') });
          },
          onError: (err) => {
            push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
          },
        },
      );
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => submit({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        () => submit(undefined),
        { timeout: 5000 },
      );
    } else {
      submit(undefined);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('emergency.reportIncidentTitle')}>
      {sent ? (
        <div className={styles.successContent}>
          <span className={styles.successIcon}>
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </span>
          <p className={styles.successText}>{t('emergency.incidentSentText')}</p>
          <Button fullWidth onClick={handleClose}>
            {t('common.close')}
          </Button>
        </div>
      ) : (
        <form className={styles.content} onSubmit={handleSubmit}>
          <p className={styles.text}>{t('emergency.reportIncidentText')}</p>

          <Input
            label={t('emergency.incidentTitleLabel')}
            name="incident-title"
            required
            minLength={3}
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className={styles.field}>
            <label htmlFor="incident-description" className={styles.label}>
              {t('emergency.incidentDescriptionLabel')}
            </label>
            <textarea
              id="incident-description"
              className={styles.textarea}
              required
              minLength={5}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? <Spinner size={18} /> : t('emergency.submitIncident')}
          </Button>
        </form>
      )}
    </Modal>
  );
}

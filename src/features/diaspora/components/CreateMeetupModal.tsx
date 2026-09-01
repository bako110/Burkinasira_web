import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

import { Modal, Button, Input } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateMeetup } from '../hooks/useCreateMeetup';
import styles from './CreateMeetupModal.module.css';

interface CreateMeetupModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateMeetupModal({ open, onClose }: CreateMeetupModalProps) {
  const { t } = useTranslation();
  const { mutate, isPending, isSuccess, error, reset } = useCreateMeetup();
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [description, setDescription] = useState('');

  function handleClose() {
    onClose();
    setTitle('');
    setRegion('');
    setScheduledAt('');
    setDescription('');
    reset();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({
      title,
      region,
      scheduled_at: new Date(scheduledAt).toISOString(),
      description: description.trim() || undefined,
    });
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('diaspora.createMeetupTitle')}>
      {isSuccess ? (
        <div className={styles.success}>
          <CheckCircle2 size={32} strokeWidth={1.5} className={styles.successIcon} />
          <p>{t('diaspora.createMeetupSuccessText')}</p>
          <Button fullWidth onClick={handleClose}>
            {t('common.back')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('diaspora.meetupTitleLabel')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            minLength={2}
            required
            autoFocus
          />
          <Input
            label={t('diaspora.meetupRegionLabel')}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          />
          <Input
            label={t('diaspora.meetupDateLabel')}
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
          />
          <Input
            label={t('family.notesOptional')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}
          <Button
            type="submit"
            fullWidth
            disabled={isPending || title.trim().length < 2 || !region.trim() || !scheduledAt}
          >
            {isPending ? t('common.loading') : t('diaspora.confirmCreateMeetup')}
          </Button>
        </form>
      )}
    </Modal>
  );
}

import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Radio } from 'lucide-react';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useStartLive } from '../hooks/useLive';
import styles from './CreateGroupModal.module.css';

interface StartLiveModalProps {
  open: boolean;
  onClose: () => void;
  groupId?: string;
}

export function StartLiveModal({ open, onClose, groupId }: StartLiveModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useStartLive();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function resetAndClose() {
    setTitle('');
    setDescription('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { title, description: description || undefined, group_id: groupId },
      {
        onSuccess: (session) => {
          push({ variant: 'success', message: t('community.liveStarted') });
          resetAndClose();
          navigate(`/community/live/${session.id}`);
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={t('community.startLiveTitle')}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.hint}>
          <Radio size={14} strokeWidth={2} />
          {t('community.startLiveHint')}
        </p>

        <Input
          label={t('community.liveTitleLabel')}
          name="live-title"
          required
          minLength={2}
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className={styles.field}>
          <label htmlFor="live-description" className={styles.label}>
            {t('community.groupDescriptionLabel')}
          </label>
          <textarea
            id="live-description"
            className={styles.textarea}
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : t('community.startLiveCta')}
        </Button>
      </form>
    </Modal>
  );
}

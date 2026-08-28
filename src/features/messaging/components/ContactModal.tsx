import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Modal, Button, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useStartConversation } from '../hooks/useStartConversation';
import type { ConversationKind } from '../types';
import styles from './ContactModal.module.css';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  kind: ConversationKind;
  otherUserId: string;
  recipientName: string;
  defaultMessage?: string;
}

export function ContactModal({ open, onClose, kind, otherUserId, recipientName, defaultMessage }: ContactModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useStartConversation();
  const [message, setMessage] = useState(defaultMessage ?? '');

  function handleClose() {
    setMessage(defaultMessage ?? '');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { kind, other_user_id: otherUserId, initial_message: message },
      {
        onSuccess: (conversation) => {
          push({ variant: 'success', message: t('messaging.contactSuccess') });
          handleClose();
          navigate(`/messages?conversation=${conversation.id}`);
        },
        onError: (err) => {
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        },
      },
    );
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('messaging.contactTitle', { name: recipientName })}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="contact-message" className={styles.label}>
            {t('messaging.messageLabel')}
          </label>
          <textarea
            id="contact-message"
            className={styles.textarea}
            required
            minLength={2}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('messaging.messagePlaceholder')}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : t('messaging.sendMessage')}
        </Button>
      </form>
    </Modal>
  );
}

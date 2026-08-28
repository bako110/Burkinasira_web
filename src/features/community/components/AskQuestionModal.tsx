import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Button, Input, Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateQuestion } from '../hooks/useQuestions';
import styles from './AskQuestionModal.module.css';

interface AskQuestionModalProps {
  open: boolean;
  onClose: () => void;
}

export function AskQuestionModal({ open, onClose }: AskQuestionModalProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { mutate, isPending, error } = useCreateQuestion();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function resetAndClose() {
    setTitle('');
    setContent('');
    onClose();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { title, content },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('community.questionPosted') });
          resetAndClose();
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Modal open={open} onClose={resetAndClose} title={t('community.askQuestionTitle')}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label={t('community.questionTitleLabel')}
          name="question-title"
          required
          minLength={3}
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className={styles.field}>
          <label htmlFor="question-content" className={styles.label}>
            {t('community.questionContentLabel')}
          </label>
          <textarea
            id="question-content"
            className={styles.textarea}
            required
            minLength={5}
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {error && <p className={styles.errorText}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isPending}>
          {isPending ? <Spinner size={18} /> : t('community.postQuestion')}
        </Button>
      </form>
    </Modal>
  );
}

import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Modal, Button, Spinner, EmptyResults } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAnswers, useAnswerQuestion } from '../hooks/useQuestions';
import type { Question } from '../types';
import styles from './QuestionDetailModal.module.css';

interface QuestionDetailModalProps {
  question: Question | null;
  onClose: () => void;
}

export function QuestionDetailModal({ question, onClose }: QuestionDetailModalProps) {
  const { t, i18n } = useTranslation();
  const requireAuth = useRequireAuth();
  const push = useToastStore((s) => s.push);
  const [answerText, setAnswerText] = useState('');

  const { data: answers, isLoading } = useAnswers(question?.id);
  const { mutate: submitAnswer, isPending } = useAnswerQuestion(question?.id ?? '');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    requireAuth(() => {
      submitAnswer(
        { content: answerText },
        {
          onSuccess: () => {
            setAnswerText('');
            push({ variant: 'success', message: t('community.answerPosted') });
          },
          onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
        },
      );
    }, t('community.answerRequiresAuth'));
  }

  if (!question) return null;

  return (
    <Modal open={Boolean(question)} onClose={onClose} title={question.title}>
      <div className={styles.content}>
        <p className={styles.questionBody}>{question.content}</p>

        <div className={styles.divider} />

        <h3 className={styles.answersTitle}>{t('community.answersTitle')}</h3>

        {isLoading && (
          <div className={styles.center}>
            <Spinner size={20} />
          </div>
        )}

        {!isLoading && (!answers || answers.length === 0) && (
          <EmptyResults variant="empty" title={t('community.noAnswers')} text={t('community.noAnswersText')} />
        )}

        {!isLoading && answers && answers.length > 0 && (
          <div className={styles.answerList}>
            {answers.map((answer) => (
              <div key={answer.id} className={styles.answerCard}>
                <p className={styles.answerContent}>{answer.content}</p>
                <span className={styles.answerDate}>
                  {new Date(answer.created_at).toLocaleDateString(i18n.language, {
                    day: '2-digit',
                    month: 'long',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        <form className={styles.answerForm} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            rows={3}
            required
            minLength={1}
            placeholder={t('community.answerPlaceholder')}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? t('common.loading') : t('community.postAnswer')}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

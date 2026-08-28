import { useTranslation } from 'react-i18next';
import { MessageCircleQuestion, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

import type { Question } from '../types';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  onClick: () => void;
}

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  const { t, i18n } = useTranslation();

  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className={clsx(styles.status, question.status === 'answered' && styles.statusAnswered)}>
          {question.status === 'answered' ? (
            <CheckCircle2 size={13} strokeWidth={2} />
          ) : (
            <MessageCircleQuestion size={13} strokeWidth={2} />
          )}
          {t(`community.questionStatus.${question.status}`)}
        </span>
        <span className={styles.date}>
          {new Date(question.created_at).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' })}
        </span>
      </div>
      <p className={styles.title}>{question.title}</p>
      <p className={styles.content}>{question.content}</p>
    </button>
  );
}

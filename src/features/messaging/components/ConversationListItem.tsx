import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import clsx from 'clsx';

import type { Conversation } from '../types';
import styles from './ConversationListItem.module.css';

interface ConversationListItemProps {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}

export function ConversationListItem({ conversation, active, onClick }: ConversationListItemProps) {
  const { t, i18n } = useTranslation();

  return (
    <button type="button" className={clsx(styles.item, active && styles.itemActive)} onClick={onClick}>
      <span className={styles.icon}>
        <MessageCircle size={18} strokeWidth={2} />
      </span>
      <div className={styles.text}>
        <span className={styles.kind}>{t(`messaging.kinds.${conversation.kind}`)}</span>
        <span className={styles.preview}>
          {conversation.last_message_preview ?? t('messaging.noMessages')}
        </span>
      </div>
      {conversation.last_message_at && (
        <span className={styles.time}>
          {new Date(conversation.last_message_at).toLocaleDateString(i18n.language, {
            day: '2-digit',
            month: '2-digit',
          })}
        </span>
      )}
    </button>
  );
}

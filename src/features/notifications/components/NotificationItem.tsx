import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';

import type { AppNotification } from '../types';
import styles from './NotificationItem.module.css';

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className={clsx(styles.card, !notification.is_read && styles.cardUnread)}>
      <button
        type="button"
        className={styles.content}
        onClick={() => !notification.is_read && onMarkRead(notification.id)}
      >
        <div className={styles.header}>
          <span className={styles.category}>{t(`notifications.categories.${notification.category}`)}</span>
          {!notification.is_read && <span className={styles.unreadDot} aria-hidden="true" />}
        </div>
        <p className={styles.title}>{notification.title}</p>
        <p className={styles.body}>{notification.body}</p>
        <span className={styles.time}>
          {new Date(notification.created_at).toLocaleDateString(i18n.language, {
            day: '2-digit',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </button>
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => onDelete(notification.id)}
        aria-label={t('common.delete')}
      >
        <Trash2 size={15} strokeWidth={2} />
      </button>
    </div>
  );
}

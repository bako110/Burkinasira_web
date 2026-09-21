import { useTranslation } from 'react-i18next';
import {
  CalendarCheck,
  Clock,
  CalendarClock,
  XCircle,
  ShieldAlert,
  CloudLightning,
  MapPinned,
  Tag,
  MessageCircle,
  Plane,
  Bell,
  Trash2,
  Check,
} from 'lucide-react';
import clsx from 'clsx';

import type { AppNotification, NotificationCategory } from '../types';
import styles from './NotificationItem.module.css';

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  reservation_confirmation: CalendarCheck,
  rappel_activite: Clock,
  changement_horaire: CalendarClock,
  annulation: XCircle,
  alerte_securite: ShieldAlert,
  alerte_meteo: CloudLightning,
  evenement_proximite: MapPinned,
  promotion_personnalisee: Tag,
  message_prestataire: MessageCircle,
  rappel_voyage: Plane,
};

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead, onDelete }: NotificationItemProps) {
  const { t, i18n } = useTranslation();
  const Icon = CATEGORY_ICONS[notification.category] ?? Bell;

  return (
    <div className={clsx(styles.card, !notification.is_read && styles.cardUnread)}>
      <span className={clsx(styles.iconWrap, !notification.is_read && styles.iconWrapUnread)} aria-hidden="true">
        <Icon size={17} strokeWidth={2} />
      </span>
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
      <div className={styles.actions}>
        {!notification.is_read && (
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => onMarkRead(notification.id)}
            aria-label={t('notifications.markAllRead')}
          >
            <Check size={15} strokeWidth={2} />
          </button>
        )}
        <button
          type="button"
          className={clsx(styles.actionBtn, styles.deleteBtn)}
          onClick={() => onDelete(notification.id)}
          aria-label={t('common.delete')}
        >
          <Trash2 size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

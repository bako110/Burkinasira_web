import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bell, Check } from 'lucide-react';
import clsx from 'clsx';

import { Spinner } from '../../../shared/ui';
import { useMyNotifications } from '../hooks/useMyNotifications';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead';
import styles from './NotificationBell.module.css';

export function NotificationBell() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications, isLoading } = useMyNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('notifications.title')}
      >
        <Bell size={19} strokeWidth={2} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>{t('notifications.title')}</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className={styles.markAllBtn}
                onClick={() => markAllRead()}
                disabled={isMarkingAll}
              >
                <Check size={13} strokeWidth={2} />
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          <div className={styles.list}>
            {isLoading && (
              <div className={styles.center}>
                <Spinner size={20} />
              </div>
            )}

            {!isLoading && (!notifications || notifications.length === 0) && (
              <p className={styles.empty}>{t('notifications.empty')}</p>
            )}

            {!isLoading &&
              notifications?.slice(0, 8).map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={clsx(styles.item, !notification.is_read && styles.itemUnread)}
                  onClick={() => !notification.is_read && markRead(notification.id)}
                >
                  <span className={styles.itemTitle}>{notification.title}</span>
                  <span className={styles.itemBody}>{notification.body}</span>
                  <span className={styles.itemTime}>
                    {new Date(notification.created_at).toLocaleDateString(i18n.language, {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </button>
              ))}
          </div>

          <Link to="/notifications" className={styles.seeAll} onClick={() => setOpen(false)}>
            {t('notifications.seeAll')}
          </Link>
        </div>
      )}
    </div>
  );
}

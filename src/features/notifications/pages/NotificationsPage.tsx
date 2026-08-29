import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Settings } from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults, DetailBackButton } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { useAuthStore } from '../../../store/auth.store';
import { getPostLoginPath } from '../../pro/utils/postLoginRedirect';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useMyNotifications } from '../hooks/useMyNotifications';
import { useMarkNotificationRead } from '../hooks/useMarkNotificationRead';
import { useMarkAllNotificationsRead } from '../hooks/useMarkAllNotificationsRead';
import { useDeleteNotification } from '../hooks/useDeleteNotification';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationPreferencesPanel } from '../components/NotificationPreferencesPanel';
import styles from './NotificationsPage.module.css';

export function NotificationsPage() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const user = useAuthStore((s) => s.user);
  const fallbackTo = user ? getPostLoginPath(user, '/') : '/';
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [showPrefs, setShowPrefs] = useState(false);

  const { data: notifications, isLoading, isError, refetch } = useMyNotifications(tab === 'unread');
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();
  const { mutate: removeNotification } = useDeleteNotification();

  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0;

  function handleDelete(id: string) {
    removeNotification(id, {
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo={fallbackTo} variant="link">
        {t('common.back')}
      </DetailBackButton>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{t('notifications.title')}</h1>
        <div className={styles.headerActions}>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={() => markAllRead()} disabled={isMarkingAll}>
              <Check size={15} strokeWidth={2} />
              {t('notifications.markAllRead')}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowPrefs((v) => !v)}>
            <Settings size={15} strokeWidth={2} />
            {t('notifications.preferences')}
          </Button>
        </div>
      </div>

      {showPrefs && <NotificationPreferencesPanel />}

      <div className={styles.tabs}>
        <button
          type="button"
          className={clsx(styles.tab, tab === 'all' && styles.tabActive)}
          onClick={() => setTab('all')}
        >
          {t('notifications.tabAll')}
        </button>
        <button
          type="button"
          className={clsx(styles.tab, tab === 'unread' && styles.tabActive)}
          onClick={() => setTab('unread')}
        >
          {t('notifications.tabUnread')}
        </button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!notifications || notifications.length === 0) && (
        <EmptyResults variant="empty" title={t('notifications.empty')} text={t('notifications.emptyText')} />
      )}

      {!isLoading && !isError && notifications && notifications.length > 0 && (
        <div className={styles.list}>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markRead}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

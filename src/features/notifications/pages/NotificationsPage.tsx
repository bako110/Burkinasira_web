import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, Settings } from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults, DetailBackButton, Reveal } from '../../../shared/ui';
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
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo={fallbackTo} className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Bell size={26} strokeWidth={1.75} />
          </span>
          <h1 className={styles.heroTitle}>{t('notifications.title')}</h1>
          {unreadCount > 0 && (
            <p className={styles.heroSubtitle}>{t('notifications.unreadCount', { count: unreadCount })}</p>
          )}
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.toolbar}>
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
              {unreadCount > 0 && <span className={styles.tabBadge}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </button>
          </div>

          <div className={styles.toolbarActions}>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={() => markAllRead()} disabled={isMarkingAll}>
                <Check size={15} strokeWidth={2} />
                {t('notifications.markAllRead')}
              </Button>
            )}
            <Button
              variant={showPrefs ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowPrefs((v) => !v)}
              aria-expanded={showPrefs}
            >
              <Settings size={15} strokeWidth={2} />
              {t('notifications.preferences')}
            </Button>
          </div>
        </div>

        {showPrefs && (
          <Reveal>
            <NotificationPreferencesPanel />
          </Reveal>
        )}

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
            {notifications.map((notification, index) => (
              <Reveal key={notification.id} delay={Math.min(index, 8) * 60}>
                <NotificationItem notification={notification} onMarkRead={markRead} onDelete={handleDelete} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

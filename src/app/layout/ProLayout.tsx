import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  User,
  CalendarClock,
  Ticket,
  Star,
  Bell,
  MessageCircle,
  Building2,
} from 'lucide-react';
import clsx from 'clsx';

import { LanguageSwitcher, ThemeToggle, ConfirmDialog } from '../../shared/ui';
import { useAuthStore } from '../../store/auth.store';
import { useLogoutConfirm } from '../../shared/hooks/useLogoutConfirm';
import { useMyNotifications } from '../../features/notifications/hooks/useMyNotifications';
import styles from './ProLayout.module.css';

const GUIDE_NAV_ITEMS = [
  { to: '/pro/guide', end: true, key: 'analytics', Icon: LayoutDashboard },
  { to: '/pro/guide/profile', end: false, key: 'profile', Icon: User },
  { to: '/pro/guide/availability', end: false, key: 'availability', Icon: CalendarClock },
  { to: '/pro/guide/bookings', end: false, key: 'bookings', Icon: Ticket },
  { to: '/pro/guide/reviews', end: false, key: 'reviews', Icon: Star },
] as const;

const PROVIDER_NAV_ITEMS = [
  { to: '/pro/provider', end: true, key: 'dashboard', Icon: Building2 },
] as const;

export function ProLayout() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { confirmOpen, requestLogout, cancelLogout, confirmLogout } = useLogoutConfirm();
  const { data: unreadNotifications } = useMyNotifications(true);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isGuide = user?.role === 'guide';
  const NAV_ITEMS = isGuide ? GUIDE_NAV_ITEMS : PROVIDER_NAV_ITEMS;
  const homePath = isGuide ? '/pro/guide' : '/pro/provider';
  const badgeKey = isGuide ? 'pro.badgeGuide' : 'pro.badgeProvider';

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const unreadCount = unreadNotifications?.length ?? 0;

  return (
    <div className={styles.shell}>
      {/* --- Desktop sidebar --- */}
      <aside className={clsx(styles.sidebar, collapsed && styles.sidebarCollapsed)}>
        <div className={styles.sidebarHeader}>
          <NavLink to={homePath} className={styles.brand}>
            <img src="/logo.png" alt="" className={styles.logo} />
            {!collapsed && <span className={styles.badge}>{t(badgeKey)}</span>}
          </NavLink>
          <button
            type="button"
            className={styles.collapseToggle}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? t('pro.expandSidebar') : t('pro.collapseSidebar')}
          >
            {collapsed ? <ChevronsRight size={16} strokeWidth={2} /> : <ChevronsLeft size={16} strokeWidth={2} />}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, end, key, Icon }) => (
            <NavLink
              key={key}
              to={to}
              end={end}
              className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
              title={collapsed ? t(`pro.tab_${key}`) : undefined}
            >
              <Icon size={18} strokeWidth={2} className={styles.navIcon} />
              <span className={clsx(styles.navLabel, collapsed && styles.labelHidden)}>{t(`pro.tab_${key}`)}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <NavLink to={`/pro/${user?.role}/messages`} className={styles.utilityLink} title={collapsed ? t('pro.messages') : undefined}>
            <MessageCircle size={18} strokeWidth={2} />
            <span className={collapsed ? styles.labelHidden : undefined}>{t('pro.messages')}</span>
          </NavLink>
          <NavLink to={`/pro/${user?.role}/notifications`} className={styles.utilityLink} title={collapsed ? t('pro.notifications') : undefined}>
            <Bell size={18} strokeWidth={2} />
            <span className={collapsed ? styles.labelHidden : undefined}>{t('pro.notifications')}</span>
            {unreadCount > 0 && <span className={styles.unreadDot} />}
          </NavLink>

          {!collapsed && (
            <div className={styles.themeRow}>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          )}

          <button type="button" className={styles.logoutBtn} onClick={requestLogout} title={collapsed ? t('auth.logout') : undefined}>
            <LogOut size={16} strokeWidth={2} />
            <span className={collapsed ? styles.labelHidden : undefined}>{t('auth.logout')}</span>
          </button>
        </div>
      </aside>

      {/* --- Mobile top bar --- */}
      <div className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.menuToggle}
          aria-label="Menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={20} strokeWidth={2} />
        </button>
        <NavLink to={homePath} className={styles.brand}>
          <img src="/logo.png" alt="" className={styles.logo} />
          <span className={styles.badge}>{t(badgeKey)}</span>
        </NavLink>
        {isGuide && (
          <NavLink to="/pro/guide/profile" className={styles.mobileProfileLink} aria-label={t('pro.tab_profile')}>
            <User size={20} strokeWidth={2} />
          </NavLink>
        )}
      </div>

      {/* --- Mobile drawer --- */}
      <div
        className={clsx(styles.scrim, drawerOpen && styles.scrimVisible)}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside className={clsx(styles.drawer, drawerOpen && styles.drawerOpen)} aria-hidden={!drawerOpen}>
        <div className={styles.sidebarHeader}>
          <span className={styles.brand}>
            <img src="/logo.png" alt="" className={styles.logo} />
            <span>{user?.full_name}</span>
          </span>
          <button type="button" className={styles.collapseToggle} aria-label="Close" onClick={() => setDrawerOpen(false)}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ to, end, key, Icon }) => (
            <NavLink
              key={key}
              to={to}
              end={end}
              className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={18} strokeWidth={2} className={styles.navIcon} />
              <span className={styles.navLabel}>{t(`pro.tab_${key}`)}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <NavLink to={`/pro/${user?.role}/messages`} className={styles.utilityLink} onClick={() => setDrawerOpen(false)}>
            <MessageCircle size={18} strokeWidth={2} />
            <span>{t('pro.messages')}</span>
          </NavLink>
          <NavLink to={`/pro/${user?.role}/notifications`} className={styles.utilityLink} onClick={() => setDrawerOpen(false)}>
            <Bell size={18} strokeWidth={2} />
            <span>{t('pro.notifications')}</span>
            {unreadCount > 0 && <span className={styles.unreadDot} />}
          </NavLink>
          <div className={styles.themeRow}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={() => {
              setDrawerOpen(false);
              requestLogout();
            }}
          >
            <LogOut size={16} strokeWidth={2} />
            <span>{t('auth.logout')}</span>
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title={t('auth.logoutConfirmTitle')}
        message={t('auth.logoutConfirmMessage')}
        confirmLabel={t('auth.logoutConfirmCta')}
        cancelLabel={t('auth.logoutCancelCta')}
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}

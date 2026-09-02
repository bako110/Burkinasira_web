import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut, Home, Compass, Map, Ticket, Bell, MessageCircle, IdCard, User } from 'lucide-react';
import clsx from 'clsx';

import { LanguageSwitcher, ThemeToggle, ConfirmDialog } from '../../shared/ui';
import { useAuthStore } from '../../store/auth.store';
import { useLogoutConfirm } from '../../shared/hooks/useLogoutConfirm';
import { MobileTabBar } from './MobileTabBar';
import { ExploreMenu } from './ExploreMenu';
import { DiscoverMenu, DISCOVER_LINKS, PRACTICAL_LINKS } from './DiscoverMenu';
import { AccountMenu } from './AccountMenu';
import { DrawerNavSection } from './DrawerNavSection';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { CartButton } from '../../features/market/components/CartButton';
import { AssistantWidget } from '../../features/assistant/components/AssistantWidget';
import styles from './AppLayout.module.css';

const ACCOUNT_LINKS = [
  { to: '/bookings', key: 'bookings', Icon: Ticket },
  { to: '/trips', key: 'trips', Icon: Map },
  { to: '/notifications', key: 'notifications', Icon: Bell },
  { to: '/messages', key: 'messages', Icon: MessageCircle },
  { to: '/passport', key: 'passport', Icon: IdCard },
  { to: '/profile', key: 'profile', Icon: User },
] as const;

const DRAWER_COLLAPSED_COUNT = 5;

export function AppLayout() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { confirmOpen, requestLogout, cancelLogout, confirmLogout } = useLogoutConfirm();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label="Menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={22} strokeWidth={2} />
          </button>

          <NavLink to="/" className={styles.brand}>
            <img src="/logo.png" alt="" className={styles.logo} />
            <span>{t('common.appName')}</span>
          </NavLink>

          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}>
              {t('nav.home')}
            </NavLink>
            <ExploreMenu />
            <NavLink
              to="/itineraries"
              className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
            >
              {t('nav.itineraries')}
            </NavLink>
            <DiscoverMenu />
          </nav>

          <div className={styles.actionsDesktop}>
            <LanguageSwitcher />
            <ThemeToggle />
            <CartButton />
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <AccountMenu />
              </>
            ) : (
              <NavLink to="/login" className={styles.loginLink}>
                {t('auth.login')}
              </NavLink>
            )}
          </div>

          <div className={styles.actionsCompact}>
            <CartButton />
            {!isAuthenticated && (
              <NavLink to="/login" className={styles.loginLinkCompact}>
                {t('auth.login')}
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <div
        className={clsx(styles.scrim, drawerOpen && styles.scrimVisible)}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside className={clsx(styles.drawer, drawerOpen && styles.drawerOpen)} aria-hidden={!drawerOpen}>
        <div className={styles.drawerHeader}>
          <span className={styles.brand}>
            <img src="/logo.png" alt="" className={styles.logo} />
            <span>{t('common.appName')}</span>
          </span>
          <button
            type="button"
            className={styles.menuToggle}
            aria-label="Close"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        <nav className={styles.drawerNav}>
          <NavLink to="/" end className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <Home size={18} strokeWidth={2} className={styles.drawerLinkIcon} />
            {t('nav.home')}
          </NavLink>
          <NavLink to="/explore" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <Compass size={18} strokeWidth={2} className={styles.drawerLinkIcon} />
            {t('nav.explore')}
          </NavLink>
          <NavLink to="/itineraries" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            <Map size={18} strokeWidth={2} className={styles.drawerLinkIcon} />
            {t('nav.itineraries')}
          </NavLink>
        </nav>

        <div className={styles.drawerDivider} />

        <DrawerNavSection
          label={t('nav.discover')}
          links={DISCOVER_LINKS}
          collapsedCount={DRAWER_COLLAPSED_COUNT}
          onNavigate={() => setDrawerOpen(false)}
        />

        <div className={styles.drawerDivider} />

        <DrawerNavSection
          label={t('nav.practical')}
          links={PRACTICAL_LINKS}
          collapsedCount={DRAWER_COLLAPSED_COUNT}
          onNavigate={() => setDrawerOpen(false)}
        />

        {isAuthenticated && (
          <>
            <div className={styles.drawerDivider} />
            <DrawerNavSection
              label={t('nav.myAccount')}
              links={ACCOUNT_LINKS}
              collapsedCount={DRAWER_COLLAPSED_COUNT}
              onNavigate={() => setDrawerOpen(false)}
            />
          </>
        )}

        <div className={styles.drawerDivider} />

        <div className={styles.drawerSection}>
          <span className={styles.drawerSectionLabel}>{t('theme.system')}</span>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className={styles.drawerFooter}>
          {isAuthenticated ? (
            <button
              className={styles.drawerLogout}
              onClick={() => {
                setDrawerOpen(false);
                requestLogout();
              }}
              type="button"
            >
              <LogOut size={18} strokeWidth={2} />
              {t('auth.logout')}
            </button>
          ) : (
            <NavLink to="/login" className={styles.drawerLogin} onClick={() => setDrawerOpen(false)}>
              {t('auth.login')}
            </NavLink>
          )}
        </div>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>

      <MobileTabBar />

      {isAuthenticated && <AssistantWidget />}

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

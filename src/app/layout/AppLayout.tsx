import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, LogOut } from 'lucide-react';
import clsx from 'clsx';

import { LanguageSwitcher, ThemeToggle, ConfirmDialog } from '../../shared/ui';
import { useAuthStore } from '../../store/auth.store';
import { useLogoutConfirm } from '../../shared/hooks/useLogoutConfirm';
import { MobileTabBar } from './MobileTabBar';
import { ExploreMenu } from './ExploreMenu';
import { DiscoverMenu } from './DiscoverMenu';
import { AccountMenu } from './AccountMenu';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { CartButton } from '../../features/market/components/CartButton';
import { AssistantWidget } from '../../features/assistant/components/AssistantWidget';
import styles from './AppLayout.module.css';

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
            {t('nav.home')}
          </NavLink>
          <NavLink to="/explore" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.explore')}
          </NavLink>
          <NavLink to="/itineraries" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.itineraries')}
          </NavLink>
          <NavLink to="/hotels" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.hotels')}
          </NavLink>
          <NavLink to="/restaurants" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.restaurants')}
          </NavLink>
          <NavLink to="/mobility" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.mobility')}
          </NavLink>
          <NavLink to="/guides" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.guides')}
          </NavLink>
          <NavLink to="/experiences" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.experiences')}
          </NavLink>
          <NavLink to="/events" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.events')}
          </NavLink>
          <NavLink to="/culture" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.culture')}
          </NavLink>
          <NavLink to="/market" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.market')}
          </NavLink>
          <NavLink to="/community" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.community')}
          </NavLink>
        </nav>

        <div className={styles.drawerDivider} />

        <nav className={styles.drawerNav}>
          <NavLink to="/edu" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.edu')}
          </NavLink>
          <NavLink to="/family" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.family')}
          </NavLink>
          <NavLink to="/roads" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.roads')}
          </NavLink>
          <NavLink to="/health" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.health')}
          </NavLink>
          <NavLink to="/emergency" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.emergency')}
          </NavLink>
          <NavLink to="/finance" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.finance')}
          </NavLink>
          <NavLink to="/connectivity" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.connectivity')}
          </NavLink>
          <NavLink to="/weather" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
            {t('nav.weather')}
          </NavLink>
        </nav>

        {isAuthenticated && (
          <>
            <div className={styles.drawerDivider} />
            <nav className={styles.drawerNav}>
              <NavLink to="/bookings" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                {t('nav.bookings')}
              </NavLink>
              <NavLink to="/trips" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                {t('nav.trips')}
              </NavLink>
              <NavLink to="/notifications" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                {t('nav.notifications')}
              </NavLink>
              <NavLink to="/messages" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                {t('nav.messages')}
              </NavLink>
              <NavLink to="/passport" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                {t('nav.passport')}
              </NavLink>
              <NavLink to="/profile" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>
                {t('nav.profile')}
              </NavLink>
            </nav>
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

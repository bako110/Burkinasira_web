import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Compass, Ticket, MessageCircle, User } from 'lucide-react';
import clsx from 'clsx';

import styles from './MobileTabBar.module.css';

const TABS = [
  { to: '/', key: 'home', end: true, Icon: Home },
  { to: '/explore', key: 'explore', end: false, Icon: Compass },
  { to: '/bookings', key: 'bookings', end: false, Icon: Ticket },
  { to: '/messages', key: 'messages', end: false, Icon: MessageCircle },
  { to: '/profile', key: 'profile', end: false, Icon: User },
] as const;

export function MobileTabBar() {
  const { t } = useTranslation();

  return (
    <nav className={styles.bar}>
      {TABS.map(({ to, key, end, Icon }) => (
        <NavLink
          key={key}
          to={to}
          end={end}
          className={({ isActive }) => clsx(styles.tab, isActive && styles.tabActive)}
        >
          <Icon size={22} strokeWidth={2} className={styles.tabIcon} />
          <span className={styles.tabLabel}>{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

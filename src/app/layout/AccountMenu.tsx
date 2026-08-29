import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Ticket, Map, MessageCircle, Trophy, Settings, LogOut, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import { useAuthStore } from '../../store/auth.store';
import { useLogoutConfirm } from '../../shared/hooks/useLogoutConfirm';
import { ConfirmDialog } from '../../shared/ui';
import styles from './AccountMenu.module.css';

const LINKS = [
  { to: '/bookings', key: 'bookings', Icon: Ticket },
  { to: '/trips', key: 'trips', Icon: Map },
  { to: '/messages', key: 'messages', Icon: MessageCircle },
  { to: '/passport', key: 'passport', Icon: Trophy },
] as const;

export function AccountMenu() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { confirmOpen, requestLogout, cancelLogout, confirmLogout } = useLogoutConfirm();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!user) return null;

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={clsx(styles.trigger, open && styles.triggerActive)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.avatar}>
          {user.avatar_url ? <img src={user.avatar_url} alt="" className={styles.avatarImg} /> : <User size={16} strokeWidth={2} />}
        </span>
        <span className={styles.name}>{user.full_name.split(' ')[0]}</span>
        <ChevronDown size={14} strokeWidth={2} className={clsx(styles.chevron, open && styles.chevronOpen)} />
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <p className={styles.panelName}>{user.full_name}</p>
            <p className={styles.panelEmail}>{user.email}</p>
          </div>

          <div className={styles.panelLinks}>
            {LINKS.map(({ to, key, Icon }) => (
              <NavLink key={key} to={to} className={styles.link} onClick={() => setOpen(false)}>
                <Icon size={16} strokeWidth={2} className={styles.linkIcon} />
                {t(`nav.${key}`)}
              </NavLink>
            ))}
            <NavLink to="/profile" className={styles.link} onClick={() => setOpen(false)}>
              <Settings size={16} strokeWidth={2} className={styles.linkIcon} />
              {t('nav.profile')}
            </NavLink>
          </div>

          <button
            type="button"
            className={styles.logoutLink}
            onClick={() => {
              setOpen(false);
              requestLogout();
            }}
          >
            <LogOut size={16} strokeWidth={2} className={styles.linkIcon} />
            {t('auth.logout')}
          </button>
        </div>
      )}

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

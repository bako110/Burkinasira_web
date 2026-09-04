import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { User, Lock, ChevronRight, LogOut } from 'lucide-react';

import { Card, Avatar, ConfirmDialog } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import { useLogoutConfirm } from '../../../shared/hooks/useLogoutConfirm';
import { ProPageHeader } from '../components/ProPageHeader';
import styles from './ProAccountPage.module.css';
import wrapperStyles from './ProPageWrapper.module.css';

/**
 * Compte du professionnel (identité, mot de passe) — l'équivalent pour l'espace
 * pro du /profile côté touriste, que le RoleGate ne laisse pas ouvrir à un
 * guide/prestataire.
 */
export function ProAccountPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { confirmOpen, requestLogout, cancelLogout, confirmLogout } = useLogoutConfirm();

  if (!user) return null;

  const base = `/pro/${user.role}/account`;

  return (
    <div className={wrapperStyles.page}>
      <ProPageHeader title={t('pro.tab_account')} />

      <Card className={styles.identityCard}>
        <Avatar src={user.avatar_url} name={user.full_name} size={56} />
        <div className={styles.identityText}>
          <span className={styles.name}>{user.full_name}</span>
          <span className={styles.email}>{user.email}</span>
        </div>
      </Card>

      <div className={styles.links}>
        <NavLink to={`${base}/info`} className={styles.link}>
          <User size={18} strokeWidth={2} className={styles.linkIcon} />
          <span>{t('profile.editTitle')}</span>
          <ChevronRight size={16} strokeWidth={2} className={styles.chevron} />
        </NavLink>
        <NavLink to={`${base}/password`} className={styles.link}>
          <Lock size={18} strokeWidth={2} className={styles.linkIcon} />
          <span>{t('profile.passwordTitle')}</span>
          <ChevronRight size={16} strokeWidth={2} className={styles.chevron} />
        </NavLink>
      </div>

      <button type="button" className={styles.logoutButton} onClick={requestLogout}>
        <LogOut size={16} strokeWidth={2} />
        {t('auth.logout')}
      </button>

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

import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { LogOut, User, Trophy, Ticket, Map, MessageCircle, ChevronRight, Trash2, ShoppingBag } from 'lucide-react';

import { Card, Input, Button, ConfirmDialog } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useLogoutConfirm } from '../../../shared/hooks/useLogoutConfirm';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useChangePassword } from '../hooks/useChangePassword';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import { DeleteAccountDialog } from '../components/DeleteAccountDialog';
import styles from './ProfilePage.module.css';

const HUB_LINKS = [
  { to: '/bookings', key: 'bookings', Icon: Ticket },
  { to: '/market/orders', key: 'orders', Icon: ShoppingBag },
  { to: '/trips', key: 'trips', Icon: Map },
  { to: '/messages', key: 'messages', Icon: MessageCircle },
] as const;

export function ProfilePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const { confirmOpen, requestLogout, cancelLogout, confirmLogout } = useLogoutConfirm();
  const push = useToastStore((s) => s.push);

  const { mutate: updateProfile, isPending: isSavingProfile, isSuccess: profileSaved, error: profileError } =
    useUpdateProfile();
  const { mutate: changePassword, isPending: isSavingPassword, isSuccess: passwordSaved, error: passwordError, reset: resetPassword } =
    useChangePassword();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    updateProfile(
      { full_name: fullName, phone: phone || undefined },
      {
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    changePassword(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  function handleDeleteAccount() {
    deleteAccount(undefined, {
      onSuccess: () => {
        push({ variant: 'success', message: t('profile.deleteSuccess') });
        clearSession();
      },
      onError: (err) => {
        push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        setDeleteOpen(false);
      },
    });
  }

  if (!user) return null;

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.identityCard}>
          <div className={styles.avatar}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className={styles.avatarImg} />
            ) : (
              <User size={28} strokeWidth={1.5} />
            )}
          </div>
          <div className={styles.identityText}>
            <h1 className={styles.name}>{user.full_name}</h1>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>

        <NavLink to="/passport" className={styles.passportLink}>
          <Card className={styles.passportCard}>
            <span className={styles.passportIcon}>
              <Trophy size={20} strokeWidth={1.75} />
            </span>
            <span className={styles.passportText}>{t('nav.passport')}</span>
            <ChevronRight size={18} strokeWidth={2} className={styles.passportChevron} />
          </Card>
        </NavLink>

        <nav className={styles.hubNav}>
          {HUB_LINKS.map(({ to, key, Icon }) => (
            <NavLink key={key} to={to} className={styles.hubLink}>
              <Icon size={18} strokeWidth={2} className={styles.hubLinkIcon} />
              <span>{t(`nav.${key}`)}</span>
              <ChevronRight size={16} strokeWidth={2} className={styles.hubLinkChevron} />
            </NavLink>
          ))}
        </nav>

        <Button variant="ghost" onClick={requestLogout} className={styles.logoutBtn}>
          <LogOut size={16} strokeWidth={2} />
          {t('auth.logout')}
        </Button>
      </aside>

      <div className={styles.main}>
        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('profile.editTitle')}</h2>
          <form onSubmit={handleProfileSubmit} className={styles.form}>
            <Input
              label={t('auth.fullName')}
              name="profile-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label={t('auth.phone')}
              name="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {profileError && (
              <p className={styles.error}>{extractApiErrorMessage(profileError, t('common.error'))}</p>
            )}
            {profileSaved && <p className={styles.success}>{t('profile.saved')}</p>}
            <Button type="submit" disabled={isSavingProfile}>
              {isSavingProfile ? t('common.loading') : t('common.save')}
            </Button>
          </form>
        </Card>

        <Card className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('profile.passwordTitle')}</h2>
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <Input
              label={t('profile.currentPassword')}
              name="profile-current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                resetPassword();
              }}
              required
            />
            <Input
              label={t('profile.newPassword')}
              name="profile-new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                resetPassword();
              }}
              required
            />
            {passwordError && (
              <p className={styles.error}>{extractApiErrorMessage(passwordError, t('common.error'))}</p>
            )}
            {passwordSaved && <p className={styles.success}>{t('profile.passwordSaved')}</p>}
            <Button type="submit" variant="secondary" disabled={isSavingPassword}>
              {isSavingPassword ? t('common.loading') : t('profile.changePassword')}
            </Button>
          </form>
        </Card>

        <Card className={styles.dangerSection}>
          <h2 className={styles.dangerTitle}>{t('profile.dangerZone')}</h2>
          <p className={styles.dangerText}>{t('profile.deleteAccountText')}</p>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={15} strokeWidth={2} />
            {t('profile.deleteAccount')}
          </Button>
        </Card>
      </div>

      <DeleteAccountDialog
        open={deleteOpen}
        isPending={isDeleting}
        onConfirm={handleDeleteAccount}
        onClose={() => setDeleteOpen(false)}
      />

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

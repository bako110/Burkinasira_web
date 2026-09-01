import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Input, Button, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useChangePassword } from '../hooks/useChangePassword';
import { getPasswordIssues, type PasswordIssue } from '../../auth/utils/passwordStrength';
import styles from './ProfileSubPage.module.css';

const PASSWORD_ISSUE_KEYS: Record<PasswordIssue, string> = {
  tooShort: 'auth.passwordTooShort',
  needsUppercase: 'auth.passwordNeedsUppercase',
  needsNumber: 'auth.passwordNeedsNumber',
};

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { mutate: changePassword, isPending, isSuccess, error, reset } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showStrengthError, setShowStrengthError] = useState(false);

  const passwordIssues = getPasswordIssues(newPassword);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (passwordIssues.length > 0) {
      setShowStrengthError(true);
      return;
    }
    setShowStrengthError(false);
    changePassword(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
        },
      },
    );
  }

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('profile.passwordTitle')}</h1>

      <Card className={styles.section}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="username"
            autoComplete="username"
            value={user?.email ?? ''}
            readOnly
            hidden
          />
          <Input
            label={t('profile.currentPassword')}
            name="profile-current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              reset();
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
              setShowStrengthError(false);
              reset();
            }}
            required
          />
          <p className={styles.hint}>{t('auth.passwordHint')}</p>
          {showStrengthError && passwordIssues.length > 0 && (
            <p className={styles.error}>{t(PASSWORD_ISSUE_KEYS[passwordIssues[0]])}</p>
          )}
          {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}
          {isSuccess && <p className={styles.success}>{t('profile.passwordSaved')}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? t('common.loading') : t('profile.changePassword')}
          </Button>
        </form>
      </Card>
    </div>
  );
}

import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import { Button, Card, PasswordInput, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { resetPassword } from '../api/auth.api';
import { AuthHeader } from '../components/AuthHeader';
import { getPasswordIssues, type PasswordIssue } from '../utils/passwordStrength';
import styles from './AuthPage.module.css';

const ISSUE_KEYS: Record<PasswordIssue, string> = {
  tooShort: 'auth.passwordTooShort',
  needsUppercase: 'auth.passwordNeedsUppercase',
  needsNumber: 'auth.passwordNeedsNumber',
};

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showError, setShowError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const issues = getPasswordIssues(password);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (issues.length > 0 || password !== confirm) {
      setShowError(true);
      return;
    }
    setIsPending(true);
    setApiError(null);
    try {
      await resetPassword(token, password);
      setDone(true);
      push({ variant: 'success', message: t('auth.resetSuccess') });
      setTimeout(() => navigate('/login', { replace: true }), 1600);
    } catch (err) {
      setApiError(extractApiErrorMessage(err, t('auth.resetError')));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <DetailBackButton fallbackTo="/login" variant="link">
          {t('common.back')}
        </DetailBackButton>
        <AuthHeader title={t('auth.resetTitle')} />

        {!token ? (
          <div className={styles.successBlock}>
            <p>{t('auth.resetNoToken')}</p>
            <Link to="/forgot-password" className={styles.backToLogin}>
              {t('auth.forgotSubmit')}
            </Link>
          </div>
        ) : done ? (
          <div className={styles.successBlock}>
            <CheckCircle2 size={40} strokeWidth={1.5} className={styles.successIcon} />
            <p>{t('auth.resetSuccess')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <PasswordInput
              label={t('auth.newPassword')}
              name="new-password"
              autoComplete="new-password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowError(false);
              }}
              showLabel={t('auth.showPassword')}
              hideLabel={t('auth.hidePassword')}
            />
            <p className={styles.hint}>{t('auth.passwordHint')}</p>
            <PasswordInput
              label={t('auth.confirmPassword')}
              name="confirm-password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setShowError(false);
              }}
              showLabel={t('auth.showPassword')}
              hideLabel={t('auth.hidePassword')}
            />
            {showError && (
              <p className={styles.error}>
                {issues.length > 0 ? t(ISSUE_KEYS[issues[0]]) : t('auth.passwordMismatch')}
              </p>
            )}
            {apiError && <p className={styles.error}>{apiError}</p>}
            <Button type="submit" fullWidth disabled={isPending}>
              {isPending ? t('common.loading') : t('auth.resetSubmit')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

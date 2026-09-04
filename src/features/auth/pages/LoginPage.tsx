import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Card, Input, PasswordInput, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { useLogin } from '../hooks/useLogin';
import { AuthHeader } from '../components/AuthHeader';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { getPostLoginPath } from '../../pro/utils/postLoginRedirect';
import styles from './AuthPage.module.css';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending, error } = useLogin();
  const push = useToastStore((s) => s.push);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          push({
            variant: 'success',
            message: t('auth.welcomeBackMessage', { name: data.user.full_name.split(' ')[0] }),
          });
          navigate(getPostLoginPath(data.user, from), { replace: true });
        },
      },
    );
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <DetailBackButton fallbackTo="/" variant="link">
          {t('common.back')}
        </DetailBackButton>
        <AuthHeader title={t('auth.login')} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label={t('auth.email')}
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label={t('auth.password')}
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showLabel={t('auth.showPassword')}
            hideLabel={t('auth.hidePassword')}
          />
          {error && (
            <p className={styles.error}>
              {extractApiErrorMessage(error, t('auth.invalidCredentials'))}
            </p>
          )}
          <Link to="/forgot-password" className={styles.forgotLink}>
            {t('auth.forgotLink')}
          </Link>
          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? t('common.loading') : t('auth.loginCta')}
          </Button>
        </form>

        <p className={styles.termsNotice}>
          {t('auth.loginTermsNoticePrefix')}{' '}
          <Link to="/cgu" target="_blank" rel="noreferrer">
            {t('auth.termsLink')}
          </Link>{' '}
          {t('auth.acceptTermsAnd')}{' '}
          <Link to="/confidentialite" target="_blank" rel="noreferrer">
            {t('auth.privacyLink')}
          </Link>
          .
        </p>

        <div className={styles.divider}>
          <span>{t('auth.orContinueWith')}</span>
        </div>
        <SocialAuthButtons />

        <p className={styles.switch}>
          {t('auth.noAccount')}{' '}
          <Link to="/register" state={location.state}>
            {t('auth.registerCta')}
          </Link>
        </p>
      </Card>
    </div>
  );
}

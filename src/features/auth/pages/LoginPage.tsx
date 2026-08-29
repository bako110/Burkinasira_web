import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button, Card, Input, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { email, password },
      { onSuccess: (data) => navigate(getPostLoginPath(data.user, from), { replace: true }) },
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
          <Input
            label={t('auth.password')}
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className={styles.error}>
              {extractApiErrorMessage(error, t('auth.invalidCredentials'))}
            </p>
          )}
          <Button type="submit" fullWidth disabled={isPending}>
            {isPending ? t('common.loading') : t('auth.loginCta')}
          </Button>
        </form>

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

import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';

import { Button, Card, Input, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { requestPasswordReset } from '../api/auth.api';
import { AuthHeader } from '../components/AuthHeader';
import styles from './AuthPage.module.css';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(extractApiErrorMessage(err, t('common.error')));
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
        <AuthHeader title={t('auth.forgotTitle')} />

        {sent ? (
          <div className={styles.successBlock}>
            <MailCheck size={40} strokeWidth={1.5} className={styles.successIcon} />
            <p>{t('auth.forgotSentText')}</p>
            <Link to="/login" className={styles.backToLogin}>
              {t('auth.loginCta')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p className={styles.hint}>{t('auth.forgotIntro')}</p>
            <Input
              label={t('auth.email')}
              type="email"
              name="email"
              autoComplete="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className={styles.error}>{error}</p>}
            <Button type="submit" fullWidth disabled={isPending || !email}>
              {isPending ? t('common.loading') : t('auth.forgotSubmit')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

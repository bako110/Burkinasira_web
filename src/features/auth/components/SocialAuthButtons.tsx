import { useTranslation } from 'react-i18next';

import { useToastStore } from '../../../store/toast.store';
import styles from './SocialAuthButtons.module.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.9-2.26c-.81.54-1.85.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.69A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.69V4.98H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.02l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.98l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
      <path d="M13.5 9.6c0-1.6 1.3-2.4 1.4-2.5-.8-1.1-2-1.3-2.4-1.3-1-.1-2 .6-2.5.6s-1.3-.6-2.2-.6c-1.1 0-2.2.7-2.7 1.7-1.2 2-.3 5 .8 6.7.6.8 1.3 1.7 2.2 1.7.9 0 1.2-.6 2.3-.6s1.4.6 2.3.6c1 0 1.6-.9 2.2-1.7.7-1 1-2 1-2-.1 0-1.9-.7-1.9-2.6zM11.7 4.4c.5-.6.8-1.4.7-2.2-.7 0-1.5.5-2 1-.4.5-.8 1.3-.7 2 .8.1 1.5-.3 2-.8z" />
    </svg>
  );
}

export function SocialAuthButtons() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);

  function handleComingSoon(provider: string) {
    push({ variant: 'info', message: t('auth.socialComingSoon', { provider }) });
  }

  return (
    <div className={styles.group}>
      <button type="button" className={styles.button} onClick={() => handleComingSoon('Google')}>
        <GoogleIcon />
        {t('auth.continueWithGoogle')}
      </button>
      <button type="button" className={styles.button} onClick={() => handleComingSoon('Apple')}>
        <AppleIcon />
        {t('auth.continueWithApple')}
      </button>
    </div>
  );
}

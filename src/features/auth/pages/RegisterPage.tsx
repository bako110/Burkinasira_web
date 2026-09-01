import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

import { Button, Card, Input, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useRegister } from '../hooks/useRegister';
import { AuthHeader } from '../components/AuthHeader';
import { StepIndicator } from '../components/StepIndicator';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import type { SignupRole } from '../types';
import { getPostLoginPath } from '../../pro/utils/postLoginRedirect';
import { getPasswordIssues, type PasswordIssue } from '../utils/passwordStrength';
import styles from './AuthPage.module.css';

const TOTAL_STEPS = 4;

const PASSWORD_ISSUE_KEYS: Record<PasswordIssue, string> = {
  tooShort: 'auth.passwordTooShort',
  needsUppercase: 'auth.passwordNeedsUppercase',
  needsNumber: 'auth.passwordNeedsNumber',
};

const ROLE_OPTIONS: { value: SignupRole; labelKey: string; descKey: string }[] = [
  { value: 'tourist', labelKey: 'auth.roleTourist', descKey: 'auth.roleTouristDesc' },
  { value: 'guide', labelKey: 'auth.roleGuide', descKey: 'auth.roleGuideDesc' },
  { value: 'provider', labelKey: 'auth.roleProvider', descKey: 'auth.roleProviderDesc' },
];

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending, error } = useRegister();

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [role, setRole] = useState<SignupRole>('tourist');

  function goNext(e: FormEvent) {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  const passwordIssues = getPasswordIssues(password);

  function handlePasswordStepSubmit(e: FormEvent) {
    e.preventDefault();
    if (passwordIssues.length > 0) {
      setPasswordError(true);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(true);
      return;
    }
    setPasswordError(false);
    goNext(e);
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate(
      { full_name: fullName, email, password, phone: phone || undefined, role },
      { onSuccess: (data) => navigate(getPostLoginPath(data.user, from), { replace: true }) },
    );
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <DetailBackButton fallbackTo="/" variant="link">
          {t('common.back')}
        </DetailBackButton>
        <AuthHeader title={t('auth.register')} subtitle={t(`auth.step${step}Subtitle`)} />

        <StepIndicator total={TOTAL_STEPS} current={step} />

        {step === 1 && (
          <form onSubmit={goNext} className={styles.form}>
            <Input
              label={t('auth.fullName')}
              name="fullName"
              autoComplete="name"
              required
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Button type="submit" fullWidth>
              {t('auth.continue')}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={goNext} className={styles.form}>
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
            <Input
              label={t('auth.phone')}
              type="tel"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className={styles.stepActions}>
              <button type="button" className={styles.backLink} onClick={goBack}>
                <ArrowLeft size={15} strokeWidth={2} />
                {t('common.back')}
              </button>
              <Button type="submit" fullWidth>
                {t('auth.continue')}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordStepSubmit} className={styles.form}>
            <Input
              label={t('auth.password')}
              type="password"
              name="password"
              autoComplete="new-password"
              required
              autoFocus
              minLength={8}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(false);
              }}
            />
            <p className={styles.hint}>{t('auth.passwordHint')}</p>
            <Input
              label={t('auth.confirmPassword')}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError(false);
              }}
            />
            {passwordError && (
              <p className={styles.error}>
                {passwordIssues.length > 0 ? t(PASSWORD_ISSUE_KEYS[passwordIssues[0]]) : t('auth.passwordMismatch')}
              </p>
            )}
            <div className={styles.stepActions}>
              <button type="button" className={styles.backLink} onClick={goBack}>
                <ArrowLeft size={15} strokeWidth={2} />
                {t('common.back')}
              </button>
              <Button type="submit" fullWidth>
                {t('auth.continue')}
              </Button>
            </div>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.roleList}>
              {ROLE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={clsx(styles.roleOption, role === opt.value && styles.roleOptionActive)}
                >
                  <input
                    type="radio"
                    name="role"
                    className={styles.roleRadio}
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                  />
                  <span className={styles.roleBody}>
                    <span className={styles.roleLabel}>{t(opt.labelKey)}</span>
                    <span className={styles.roleDesc}>{t(opt.descKey)}</span>
                  </span>
                </label>
              ))}
            </div>
            {error && (
              <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>
            )}
            <div className={styles.stepActions}>
              <button type="button" className={styles.backLink} onClick={goBack}>
                <ArrowLeft size={15} strokeWidth={2} />
                {t('common.back')}
              </button>
              <Button type="submit" fullWidth disabled={isPending}>
                {isPending ? t('common.loading') : t('auth.finish')}
              </Button>
            </div>
          </form>
        )}

        {step === 1 && (
          <>
            <div className={styles.divider}>
              <span>{t('auth.orContinueWith')}</span>
            </div>
            <SocialAuthButtons />
          </>
        )}

        <p className={styles.switch}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" state={location.state}>
            {t('auth.loginCta')}
          </Link>
        </p>
      </Card>
    </div>
  );
}

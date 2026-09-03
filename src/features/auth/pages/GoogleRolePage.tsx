import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { Button, Card } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { AuthHeader } from '../components/AuthHeader';
import { useFinalizeGoogleRole } from '../hooks/useGoogleLogin';
import type { SignupRole } from '../types';
import { getPostLoginPath } from '../../pro/utils/postLoginRedirect';
import styles from './AuthPage.module.css';

const ROLE_OPTIONS: { value: SignupRole; labelKey: string; descKey: string }[] = [
  { value: 'tourist', labelKey: 'auth.roleTourist', descKey: 'auth.roleTouristDesc' },
  { value: 'guide', labelKey: 'auth.roleGuide', descKey: 'auth.roleGuideDesc' },
  { value: 'provider', labelKey: 'auth.roleProvider', descKey: 'auth.roleProviderDesc' },
];

interface GoogleRoleState {
  idToken?: string;
  from?: string;
}

/**
 * Écran affiché juste après une PREMIÈRE connexion Google (compte créé en
 * "tourist" par défaut). L'utilisateur confirme son profil ; s'il choisit
 * guide/prestataire, on rappelle /auth/google avec ce rôle et le même id_token.
 * Accessible uniquement avec un id_token passé en state de navigation.
 */
export function GoogleRolePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const push = useToastStore((s) => s.push);
  const finalize = useFinalizeGoogleRole();

  const state = (location.state as GoogleRoleState | null) ?? {};
  const idToken = state.idToken;
  const from = state.from ?? '/';

  const [role, setRole] = useState<SignupRole>('tourist');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Pas d'id_token -> on n'est pas dans le bon contexte : retour à l'accueil.
  if (!idToken) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!idToken) return;

    if (role === 'tourist') {
      // Rien à confirmer côté serveur, le compte est déjà "tourist".
      navigate(from, { replace: true });
      return;
    }

    finalize.mutate(
      { idToken, role },
      {
        onSuccess: (data) => navigate(getPostLoginPath(data.user, from), { replace: true }),
        onError: (err) =>
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <AuthHeader title={t('auth.googleRoleTitle')} subtitle={t('auth.googleRoleSubtitle')} />

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

          {role !== 'tourist' && (
            <label className={styles.termsCheck}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>
                {t('auth.acceptTermsPrefix')}{' '}
                <Link to="/cgu" target="_blank" rel="noreferrer">
                  {t('auth.termsLink')}
                </Link>{' '}
                {t('auth.acceptTermsAnd')}{' '}
                <Link to="/confidentialite" target="_blank" rel="noreferrer">
                  {t('auth.privacyLink')}
                </Link>
              </span>
            </label>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={finalize.isPending || (role !== 'tourist' && !acceptedTerms)}
          >
            {finalize.isPending ? t('common.loading') : t('auth.googleRoleContinue')}
          </Button>
        </form>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';

export function useLogoutConfirm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const clearSession = useAuthStore((s) => s.clearSession);
  const push = useToastStore((s) => s.push);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function requestLogout() {
    setConfirmOpen(true);
  }

  function cancelLogout() {
    setConfirmOpen(false);
  }

  function confirmLogout() {
    setConfirmOpen(false);
    // Naviguer avant de vider la session : certaines routes (ex. /pro/*) sont
    // protégées par un garde qui redirige lui-même vers /login dès que
    // isAuthenticated passe à false. Si clearSession() s'exécute en premier,
    // ce garde peut se re-render et gagner la course avant que ce navigate('/')
    // prenne effet (observé sur mobile) — on atterrit alors sur /login au lieu
    // de l'accueil après déconnexion.
    navigate('/', { replace: true });
    clearSession();
    push({ variant: 'info', message: t('auth.logoutSuccess') });
  }

  return { confirmOpen, requestLogout, cancelLogout, confirmLogout };
}

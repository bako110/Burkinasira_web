import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';

export function useLogoutConfirm() {
  const { t } = useTranslation();
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
    clearSession();
    push({ variant: 'info', message: t('auth.logoutSuccess') });
  }

  return { confirmOpen, requestLogout, cancelLogout, confirmLogout };
}

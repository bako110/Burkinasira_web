import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';

export function useRequireAuth() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const push = useToastStore((s) => s.push);

  return useCallback(
    (action: () => void, message?: string) => {
      if (isAuthenticated) {
        action();
        return;
      }
      const from = location.pathname + location.search;
      push({
        variant: 'info',
        message: message ?? t('auth.requiredToast'),
        actionLabel: t('auth.login'),
        onAction: () => navigate('/login', { state: { from } }),
      });
    },
    [isAuthenticated, location, navigate, push, t],
  );
}

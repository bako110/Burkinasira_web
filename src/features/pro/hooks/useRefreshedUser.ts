import { useEffect, useState } from 'react';

import { useAuthStore } from '../../../store/auth.store';
import { fetchMe } from '../../auth/api/auth.api';

/**
 * Re-fetches the current account from the server on mount so role/verification
 * changes made elsewhere (e.g. an admin approving or resetting the account)
 * are picked up immediately on the next page load/refresh, instead of trusting
 * the possibly-stale user object cached in localStorage since login.
 */
export function useRefreshedUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const clearSession = useAuthStore((s) => s.clearSession);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setChecked(true);
      return;
    }
    let cancelled = false;
    fetchMe()
      .then((fresh) => {
        if (cancelled) return;
        updateUser(fresh);
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return { checked, isAuthenticated, user };
}

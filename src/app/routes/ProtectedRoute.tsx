import { Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '../../store/auth.store';
import { AuthRequiredModal } from '../../shared/ui/AuthRequiredModal';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <AuthRequiredModal open from={location.pathname + location.search} />;
  }

  return <Outlet />;
}

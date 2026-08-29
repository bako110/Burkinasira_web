import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useRefreshedUser } from '../../features/pro/hooks/useRefreshedUser';
import { getPostLoginPath } from '../../features/pro/utils/postLoginRedirect';

/**
 * Wraps the /pro/* route tree. Re-checks status from the server on every
 * mount so a guide/provider is bounced between /pro/pending and /pro/{role}/*
 * automatically as soon as their verification status changes, and a tourist
 * account can never land on these screens at all.
 */
export function ProRouteGate() {
  const { checked, isAuthenticated, user } = useRefreshedUser();
  const location = useLocation();

  if (!checked) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  }

  if (!user || (user.role !== 'guide' && user.role !== 'provider')) {
    return <Navigate to="/" replace />;
  }

  const target = getPostLoginPath(user, '/');
  const isOnTargetTree = location.pathname === target || location.pathname.startsWith(`${target}/`);
  if (!isOnTargetTree) {
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
}

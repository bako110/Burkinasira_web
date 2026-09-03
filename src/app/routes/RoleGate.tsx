import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useRefreshedUser } from '../../features/pro/hooks/useRefreshedUser';
import { getPostLoginPath } from '../../features/pro/utils/postLoginRedirect';

// Utility screens shared between the tourist and pro trees. Messages/notifications
// AND the BurkinaSira card now all have dedicated /pro/{role}/* routes wrapped in
// ProLayout, so a guide/provider hitting the bare tourist route is bounced to
// their pro dashboard (which then routes them to the pro version of the screen).
// Never add tourist-discovery pages (home, explore, etc.) here.
const SHARED_UTILITY_PATHS: string[] = [];

/**
 * Wraps the tourist-facing route tree. Re-checks the account's role/verification
 * status from the server on every mount so a guide/provider account can never
 * land back on the tourist screens after a refresh, even if their status
 * changed (e.g. an admin verified or reset them) since the token was issued.
 */
export function RoleGate() {
  const { checked, isAuthenticated, user } = useRefreshedUser();
  const location = useLocation();

  if (!checked) return null;

  const isSharedUtilityPath = SHARED_UTILITY_PATHS.some(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  if (isAuthenticated && user && (user.role === 'guide' || user.role === 'provider') && !isSharedUtilityPath) {
    return <Navigate to={getPostLoginPath(user, '/')} replace />;
  }

  return <Outlet />;
}

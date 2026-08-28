import { useQuery } from '@tanstack/react-query';

import { fetchSecurityAlerts } from '../api/emergency.api';

export function useSecurityAlerts(region?: string) {
  return useQuery({
    queryKey: ['security-alerts', region],
    queryFn: () => fetchSecurityAlerts(region),
  });
}

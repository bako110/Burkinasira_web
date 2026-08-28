import { useQuery } from '@tanstack/react-query';

import { fetchConnectivityPoints } from '../api/connectivity.api';
import type { ConnectivityFilters } from '../types';

export function useConnectivityPoints(filters: ConnectivityFilters = {}) {
  return useQuery({
    queryKey: ['connectivity-points', filters],
    queryFn: () => fetchConnectivityPoints(filters),
  });
}

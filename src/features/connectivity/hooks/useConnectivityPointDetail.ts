import { useQuery } from '@tanstack/react-query';

import { fetchConnectivityPointById } from '../api/connectivity.api';

export function useConnectivityPointDetail(pointId: string | undefined) {
  return useQuery({
    queryKey: ['connectivity-point-detail', pointId],
    queryFn: () => fetchConnectivityPointById(pointId!),
    enabled: Boolean(pointId),
    retry: false,
  });
}

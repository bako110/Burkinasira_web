import { useQuery } from '@tanstack/react-query';

import { fetchRoadServiceById } from '../api/roads.api';

export function useRoadServiceDetail(serviceId: string | undefined) {
  return useQuery({
    queryKey: ['road-service-detail', serviceId],
    queryFn: () => fetchRoadServiceById(serviceId!),
    enabled: Boolean(serviceId),
    retry: false,
  });
}

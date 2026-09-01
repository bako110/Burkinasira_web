import { useQuery } from '@tanstack/react-query';

import { fetchFamilyServiceById } from '../api/family.api';

export function useFamilyServiceDetail(serviceId: string | undefined) {
  return useQuery({
    queryKey: ['family-service-detail', serviceId],
    queryFn: () => fetchFamilyServiceById(serviceId!),
    enabled: Boolean(serviceId),
    retry: false,
  });
}

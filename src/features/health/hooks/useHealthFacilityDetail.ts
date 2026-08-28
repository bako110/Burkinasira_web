import { useQuery } from '@tanstack/react-query';

import { fetchHealthFacilityById } from '../api/health.api';

export function useHealthFacilityDetail(facilityId: string | undefined) {
  return useQuery({
    queryKey: ['health-facility-detail', facilityId],
    queryFn: () => fetchHealthFacilityById(facilityId!),
    enabled: Boolean(facilityId),
    retry: false,
  });
}

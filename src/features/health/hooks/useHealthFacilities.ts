import { useQuery } from '@tanstack/react-query';

import { fetchHealthFacilities } from '../api/health.api';
import type { HealthFacilityFilters } from '../types';

export function useHealthFacilities(filters: HealthFacilityFilters = {}) {
  return useQuery({
    queryKey: ['health-facilities', filters],
    queryFn: () => fetchHealthFacilities(filters),
  });
}

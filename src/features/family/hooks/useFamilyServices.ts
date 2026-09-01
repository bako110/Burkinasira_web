import { useQuery } from '@tanstack/react-query';

import { fetchFamilyServices } from '../api/family.api';
import type { FamilyServiceFilters } from '../types';

export function useFamilyServices(filters: FamilyServiceFilters = {}) {
  return useQuery({
    queryKey: ['family-services', filters],
    queryFn: () => fetchFamilyServices(filters),
  });
}

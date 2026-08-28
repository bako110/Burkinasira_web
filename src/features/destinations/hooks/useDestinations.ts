import { useQuery } from '@tanstack/react-query';

import { fetchDestinations } from '../api/destinations.api';
import type { DestinationFilters } from '../types';

export function useDestinations(filters: DestinationFilters = {}) {
  return useQuery({
    queryKey: ['destinations', filters],
    queryFn: () => fetchDestinations(filters),
  });
}

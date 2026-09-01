import { useQuery } from '@tanstack/react-query';

import { fetchRoadServices } from '../api/roads.api';
import type { RoadServiceFilters } from '../types';

export function useRoadServices(filters: RoadServiceFilters = {}) {
  return useQuery({
    queryKey: ['road-services', filters],
    queryFn: () => fetchRoadServices(filters),
  });
}

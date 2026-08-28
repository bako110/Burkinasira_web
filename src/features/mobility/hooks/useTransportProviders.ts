import { useQuery } from '@tanstack/react-query';

import { fetchTransportProviders } from '../api/mobility.api';
import type { MobilityFilters } from '../types';

export function useTransportProviders(filters: MobilityFilters = {}) {
  return useQuery({
    queryKey: ['transport-providers', filters],
    queryFn: () => fetchTransportProviders(filters),
  });
}

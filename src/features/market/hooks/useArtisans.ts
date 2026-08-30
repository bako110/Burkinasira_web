import { useQuery } from '@tanstack/react-query';

import { fetchArtisans } from '../api/market.api';
import type { ArtisanFilters } from '../types';

export function useArtisans(filters: ArtisanFilters = {}) {
  return useQuery({
    queryKey: ['market-artisans', filters],
    queryFn: () => fetchArtisans(filters),
  });
}

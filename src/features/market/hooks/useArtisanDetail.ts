import { useQuery } from '@tanstack/react-query';

import { fetchArtisanById } from '../api/market.api';

export function useArtisanDetail(artisanId: string | undefined) {
  return useQuery({
    queryKey: ['artisan-detail', artisanId],
    queryFn: () => fetchArtisanById(artisanId!),
    enabled: Boolean(artisanId),
    retry: false,
  });
}

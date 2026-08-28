import { useQuery } from '@tanstack/react-query';

import { fetchDestinationBySlug } from '../api/destinations.api';

export function useDestinationDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ['destination-detail', slug],
    queryFn: () => fetchDestinationBySlug(slug!),
    enabled: Boolean(slug),
    retry: false,
  });
}

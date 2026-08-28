import { useQueries } from '@tanstack/react-query';

import { fetchDestinationById } from '../../destinations/api/destinations.api';

export function useRelatedDestinations(ids: string[] | undefined) {
  const queries = useQueries({
    queries: (ids ?? []).map((id) => ({
      queryKey: ['destination-by-id', id],
      queryFn: () => fetchDestinationById(id),
      retry: false,
    })),
  });

  const destinations = queries.map((q) => q.data).filter((d) => d !== undefined);
  const isLoading = queries.some((q) => q.isLoading);

  return { destinations, isLoading };
}

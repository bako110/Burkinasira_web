import { useQueries } from '@tanstack/react-query';

import { fetchTransportProviderById } from '../../mobility/api/mobility.api';

export function useLinkedTransportProviders(ids: string[] | undefined) {
  const queries = useQueries({
    queries: (ids ?? []).map((id) => ({
      queryKey: ['transport-provider-detail', id],
      queryFn: () => fetchTransportProviderById(id),
      retry: false,
    })),
  });

  return queries.map((q) => q.data).filter((d) => d !== undefined);
}

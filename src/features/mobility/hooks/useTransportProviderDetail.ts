import { useQuery } from '@tanstack/react-query';

import { fetchTransportProviderById } from '../api/mobility.api';

export function useTransportProviderDetail(providerId: string | undefined) {
  return useQuery({
    queryKey: ['transport-provider-detail', providerId],
    queryFn: () => fetchTransportProviderById(providerId!),
    enabled: Boolean(providerId),
    retry: false,
  });
}

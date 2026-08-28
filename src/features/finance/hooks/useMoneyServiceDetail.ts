import { useQuery } from '@tanstack/react-query';

import { fetchMoneyServiceById } from '../api/finance.api';

export function useMoneyServiceDetail(serviceId: string | undefined) {
  return useQuery({
    queryKey: ['money-service-detail', serviceId],
    queryFn: () => fetchMoneyServiceById(serviceId!),
    enabled: Boolean(serviceId),
    retry: false,
  });
}

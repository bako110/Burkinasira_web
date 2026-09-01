import { useQuery } from '@tanstack/react-query';

import { fetchMyQuoteRequests } from '../api/business.api';

export function useMyQuoteRequests() {
  return useQuery({
    queryKey: ['business-my-quotes'],
    queryFn: fetchMyQuoteRequests,
  });
}

import { useQuery } from '@tanstack/react-query';

import { fetchQuoteRequestById } from '../api/business.api';

export function useQuoteRequestDetail(quoteId: string | undefined) {
  return useQuery({
    queryKey: ['business-quote-detail', quoteId],
    queryFn: () => fetchQuoteRequestById(quoteId!),
    enabled: Boolean(quoteId),
    retry: false,
  });
}

import { useQuery } from '@tanstack/react-query';

import { fetchInvoicesForQuote } from '../api/business.api';

export function useQuoteInvoices(quoteId: string | undefined) {
  return useQuery({
    queryKey: ['business-quote-invoices', quoteId],
    queryFn: () => fetchInvoicesForQuote(quoteId!),
    enabled: Boolean(quoteId),
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { respondToQuote } from '../api/business.api';

export function useRespondToQuote(quoteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accept: boolean) => respondToQuote(quoteId, accept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-quote-detail', quoteId] });
      queryClient.invalidateQueries({ queryKey: ['business-my-quotes'] });
    },
  });
}

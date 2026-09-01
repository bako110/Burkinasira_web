import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createQuoteRequest } from '../api/business.api';

export function useCreateQuoteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuoteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-my-quotes'] });
    },
  });
}

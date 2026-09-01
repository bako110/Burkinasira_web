import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeEventParticipant } from '../api/business.api';

export function useRemoveEventParticipant(quoteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeEventParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-event-participants', quoteId] });
    },
  });
}

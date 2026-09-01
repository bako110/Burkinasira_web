import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addEventParticipant } from '../api/business.api';
import type { AddEventParticipantPayload } from '../types';

export function useAddEventParticipant(quoteId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddEventParticipantPayload) => addEventParticipant(quoteId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-event-participants', quoteId] });
    },
  });
}

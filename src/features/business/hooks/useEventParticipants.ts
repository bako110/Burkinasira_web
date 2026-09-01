import { useQuery } from '@tanstack/react-query';

import { fetchEventParticipants } from '../api/business.api';

export function useEventParticipants(quoteId: string | undefined) {
  return useQuery({
    queryKey: ['business-event-participants', quoteId],
    queryFn: () => fetchEventParticipants(quoteId!),
    enabled: Boolean(quoteId),
  });
}

import { useQuery } from '@tanstack/react-query';

import { fetchEventById } from '../api/events.api';

export function useEventDetail(eventId: string | undefined) {
  return useQuery({
    queryKey: ['event-detail', eventId],
    queryFn: () => fetchEventById(eventId!),
    enabled: Boolean(eventId),
    retry: false,
  });
}

import { useQuery } from '@tanstack/react-query';

import { fetchEvents } from '../api/events.api';
import type { EventFilters } from '../types';

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => fetchEvents(filters),
  });
}

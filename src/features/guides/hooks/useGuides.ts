import { useQuery } from '@tanstack/react-query';

import { fetchGuides } from '../api/guides.api';
import type { GuideFilters } from '../types';

export function useGuides(filters: GuideFilters = {}) {
  return useQuery({
    queryKey: ['guides', filters],
    queryFn: () => fetchGuides(filters),
  });
}

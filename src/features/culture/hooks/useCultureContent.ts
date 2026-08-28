import { useQuery } from '@tanstack/react-query';

import { fetchCultureContent } from '../api/culture.api';
import type { CultureFilters } from '../types';

export function useCultureContent(filters: CultureFilters = {}) {
  return useQuery({
    queryKey: ['culture-content', filters],
    queryFn: () => fetchCultureContent(filters),
  });
}

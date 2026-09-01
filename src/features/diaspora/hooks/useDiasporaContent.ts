import { useQuery } from '@tanstack/react-query';

import { fetchDiasporaContent } from '../api/diaspora.api';
import type { DiasporaContentFilters } from '../types';

export function useDiasporaContent(filters: DiasporaContentFilters = {}) {
  return useQuery({
    queryKey: ['diaspora-content', filters],
    queryFn: () => fetchDiasporaContent(filters),
  });
}

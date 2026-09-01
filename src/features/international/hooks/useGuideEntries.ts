import { useQuery } from '@tanstack/react-query';

import { fetchGuideEntries } from '../api/international.api';
import type { FirstVisitGuideCategory } from '../types';

export function useGuideEntries(language: string, category?: FirstVisitGuideCategory) {
  return useQuery({
    queryKey: ['first-visit-guide', language, category],
    queryFn: () => fetchGuideEntries(language, category),
  });
}

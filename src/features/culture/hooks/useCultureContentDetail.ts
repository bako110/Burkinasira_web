import { useQuery } from '@tanstack/react-query';

import { fetchCultureContentById } from '../api/culture.api';

export function useCultureContentDetail(contentId: string | undefined) {
  return useQuery({
    queryKey: ['culture-content-detail', contentId],
    queryFn: () => fetchCultureContentById(contentId!),
    enabled: Boolean(contentId),
    retry: false,
  });
}

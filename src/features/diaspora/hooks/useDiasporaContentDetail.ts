import { useQuery } from '@tanstack/react-query';

import { fetchDiasporaContentById } from '../api/diaspora.api';

export function useDiasporaContentDetail(contentId: string | undefined) {
  return useQuery({
    queryKey: ['diaspora-content-detail', contentId],
    queryFn: () => fetchDiasporaContentById(contentId!),
    enabled: Boolean(contentId),
    retry: false,
  });
}

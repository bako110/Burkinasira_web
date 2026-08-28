import { useQuery } from '@tanstack/react-query';

import { fetchGuideById } from '../api/guides.api';

export function useGuideDetail(guideId: string | undefined) {
  return useQuery({
    queryKey: ['guide-detail', guideId],
    queryFn: () => fetchGuideById(guideId!),
    enabled: Boolean(guideId),
    retry: false,
  });
}

import { useQuery } from '@tanstack/react-query';

import { fetchMyGuideAnalytics } from '../api/guideAnalytics.api';

export function useMyGuideAnalytics() {
  return useQuery({
    queryKey: ['my-guide-analytics'],
    queryFn: fetchMyGuideAnalytics,
  });
}

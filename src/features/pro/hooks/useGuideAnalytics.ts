import { useQuery } from '@tanstack/react-query';

import { fetchMyGuideAnalytics, fetchMyProviderAnalytics } from '../api/guideAnalytics.api';
import type { ProviderItemType } from '../types';

export function useMyGuideAnalytics() {
  return useQuery({
    queryKey: ['my-guide-analytics'],
    queryFn: fetchMyGuideAnalytics,
  });
}

export function useMyProviderAnalytics(itemType: ProviderItemType, itemId: string | undefined) {
  return useQuery({
    queryKey: ['my-provider-analytics', itemType, itemId],
    queryFn: () => fetchMyProviderAnalytics(itemType, itemId as string),
    enabled: Boolean(itemId),
  });
}

import { apiClient } from '../../../shared/api/client';
import type { GuideAnalyticsSummary, ProviderItemType } from '../types';

export async function fetchMyGuideAnalytics(): Promise<GuideAnalyticsSummary> {
  const { data } = await apiClient.get<GuideAnalyticsSummary>('/guides/me/analytics');
  return data;
}

export async function fetchMyProviderAnalytics(
  itemType: ProviderItemType,
  itemId: string,
): Promise<GuideAnalyticsSummary> {
  const { data } = await apiClient.get<GuideAnalyticsSummary>('/analytics/pro/me/timeseries', {
    params: { item_type: itemType, item_id: itemId },
  });
  return data;
}

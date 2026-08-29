import { apiClient } from '../../../shared/api/client';
import type { GuideAnalyticsSummary } from '../types';

export async function fetchMyGuideAnalytics(): Promise<GuideAnalyticsSummary> {
  const { data } = await apiClient.get<GuideAnalyticsSummary>('/guides/me/analytics');
  return data;
}

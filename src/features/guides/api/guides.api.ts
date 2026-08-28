import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { GuideDetail, GuideFilters, GuideSummary } from '../types';

export async function fetchGuides(filters: GuideFilters = {}): Promise<PaginatedResponse<GuideSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<GuideSummary>>('/guides', {
    params: filters,
  });
  return data;
}

export async function fetchGuideById(guideId: string): Promise<GuideDetail> {
  const { data } = await apiClient.get<GuideDetail>(`/guides/${guideId}`);
  return data;
}

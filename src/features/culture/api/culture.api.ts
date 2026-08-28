import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { CultureContentDetail, CultureContentSummary, CultureFilters } from '../types';

export async function fetchCultureContent(
  filters: CultureFilters = {},
): Promise<PaginatedResponse<CultureContentSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<CultureContentSummary>>('/culture/content', {
    params: filters,
  });
  return data;
}

export async function fetchCultureContentById(contentId: string): Promise<CultureContentDetail> {
  const { data } = await apiClient.get<CultureContentDetail>(`/culture/content/${contentId}`);
  return data;
}

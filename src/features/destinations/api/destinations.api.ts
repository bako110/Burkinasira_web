import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { Destination, DestinationDetail, DestinationFilters } from '../types';

export async function fetchDestinations(
  filters: DestinationFilters = {},
): Promise<PaginatedResponse<Destination>> {
  const { data } = await apiClient.get<PaginatedResponse<Destination>>('/destinations', {
    params: filters,
  });
  return data;
}

export async function fetchDestinationBySlug(slug: string): Promise<DestinationDetail> {
  const { data } = await apiClient.get<DestinationDetail>(`/destinations/slug/${slug}`);
  return data;
}

export async function fetchDestinationById(id: string): Promise<DestinationDetail> {
  const { data } = await apiClient.get<DestinationDetail>(`/destinations/${id}`);
  return data;
}

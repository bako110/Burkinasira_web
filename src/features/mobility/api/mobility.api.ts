import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { MobilityFilters, TransportProviderDetail, TransportProviderSummary } from '../types';

export async function fetchTransportProviders(
  filters: MobilityFilters = {},
): Promise<PaginatedResponse<TransportProviderSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<TransportProviderSummary>>('/mobility/providers', {
    params: filters,
  });
  return data;
}

export async function fetchTransportProviderById(providerId: string): Promise<TransportProviderDetail> {
  const { data } = await apiClient.get<TransportProviderDetail>(`/mobility/providers/${providerId}`);
  return data;
}

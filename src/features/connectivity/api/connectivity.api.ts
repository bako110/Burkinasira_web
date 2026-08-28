import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { ConnectivityFilters, ConnectivityPointDetail, ConnectivityPointSummary } from '../types';

export async function fetchConnectivityPoints(
  filters: ConnectivityFilters = {},
): Promise<PaginatedResponse<ConnectivityPointSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<ConnectivityPointSummary>>('/connectivity', {
    params: filters,
  });
  return data;
}

export async function fetchConnectivityPointById(pointId: string): Promise<ConnectivityPointDetail> {
  const { data } = await apiClient.get<ConnectivityPointDetail>(`/connectivity/${pointId}`);
  return data;
}

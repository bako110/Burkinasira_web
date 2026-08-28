import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { MoneyServiceDetail, MoneyServiceFilters, MoneyServiceSummary } from '../types';

export async function fetchMoneyServices(
  filters: MoneyServiceFilters = {},
): Promise<PaginatedResponse<MoneyServiceSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<MoneyServiceSummary>>('/money-services', {
    params: filters,
  });
  return data;
}

export async function fetchMoneyServiceById(serviceId: string): Promise<MoneyServiceDetail> {
  const { data } = await apiClient.get<MoneyServiceDetail>(`/money-services/${serviceId}`);
  return data;
}

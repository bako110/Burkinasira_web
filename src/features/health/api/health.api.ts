import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { HealthFacilityDetail, HealthFacilityFilters, HealthFacilitySummary } from '../types';

export async function fetchHealthFacilities(
  filters: HealthFacilityFilters = {},
): Promise<PaginatedResponse<HealthFacilitySummary>> {
  const { data } = await apiClient.get<PaginatedResponse<HealthFacilitySummary>>('/health-facilities', {
    params: filters,
  });
  return data;
}

export async function fetchHealthFacilityById(facilityId: string): Promise<HealthFacilityDetail> {
  const { data } = await apiClient.get<HealthFacilityDetail>(`/health-facilities/${facilityId}`);
  return data;
}

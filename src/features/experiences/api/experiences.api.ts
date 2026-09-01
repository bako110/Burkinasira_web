import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { ExperienceDetail, ExperienceFilters, ExperienceSummary } from '../types';

export async function fetchExperiences(
  filters: ExperienceFilters = {},
): Promise<PaginatedResponse<ExperienceSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<ExperienceSummary>>('/experiences', {
    params: filters,
  });
  return data;
}

export async function fetchExperienceById(experienceId: string): Promise<ExperienceDetail> {
  const { data } = await apiClient.get<ExperienceDetail>(`/experiences/${experienceId}`);
  return data;
}

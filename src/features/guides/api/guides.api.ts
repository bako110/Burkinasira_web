import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { AvailabilitySlot, GuideDetail, GuideFilters, GuideSummary } from '../types';
import type { Conversation } from '../../messaging/types';

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

export async function fetchGuideAvailableSlots(guideId: string): Promise<AvailabilitySlot[]> {
  const { data } = await apiClient.get<AvailabilitySlot[]>(`/availability/${guideId}`, {
    params: { available_only: true },
  });
  return data;
}

export async function contactGuideAboutSlot(slotId: string): Promise<Conversation> {
  const { data } = await apiClient.post<Conversation>(`/availability/${slotId}/contact`);
  return data;
}

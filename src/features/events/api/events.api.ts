import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { EventDetail, EventFilters, EventSummary } from '../types';

export async function fetchEvents(filters: EventFilters = {}): Promise<PaginatedResponse<EventSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<EventSummary>>('/events', {
    params: filters,
  });
  return data;
}

export async function fetchEventById(eventId: string): Promise<EventDetail> {
  const { data } = await apiClient.get<EventDetail>(`/events/${eventId}`);
  return data;
}

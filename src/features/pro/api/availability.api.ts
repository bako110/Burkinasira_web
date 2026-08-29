import { apiClient } from '../../../shared/api/client';
import type { AvailabilitySlot, CreateAvailabilitySlotPayload } from '../types';

export async function fetchGuideAvailability(guideId: string, date?: string): Promise<AvailabilitySlot[]> {
  const { data } = await apiClient.get<AvailabilitySlot[]>(`/availability/${guideId}`, {
    params: date ? { date } : undefined,
  });
  return data;
}

export async function createAvailabilitySlot(payload: CreateAvailabilitySlotPayload): Promise<AvailabilitySlot> {
  const { data } = await apiClient.post<AvailabilitySlot>('/availability/me', payload);
  return data;
}

export async function deleteAvailabilitySlot(slotId: string): Promise<void> {
  await apiClient.delete(`/availability/me/${slotId}`);
}

import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type {
  CreateEduBookingPayload,
  EduBooking,
  EduOuting,
  EduOutingFilters,
  EduParticipant,
} from '../types';

export async function fetchEduOutings(
  filters: EduOutingFilters = {},
): Promise<PaginatedResponse<EduOuting>> {
  const { data } = await apiClient.get<PaginatedResponse<EduOuting>>('/edu/outings', {
    params: filters,
  });
  return data;
}

export async function fetchEduOutingById(outingId: string): Promise<EduOuting> {
  const { data } = await apiClient.get<EduOuting>(`/edu/outings/${outingId}`);
  return data;
}

export async function bookEduOuting(payload: CreateEduBookingPayload): Promise<EduBooking> {
  const { data } = await apiClient.post<EduBooking>('/edu/bookings', payload);
  return data;
}

export async function fetchMyEduBookings(): Promise<EduBooking[]> {
  const { data } = await apiClient.get<EduBooking[]>('/edu/bookings/me');
  return data;
}

export async function addEduParticipant(
  bookingId: string,
  payload: { full_name: string; notes?: string },
): Promise<EduParticipant> {
  const { data } = await apiClient.post<EduParticipant>(
    `/edu/bookings/${bookingId}/participants`,
    payload,
  );
  return data;
}

export async function fetchEduParticipants(bookingId: string): Promise<EduParticipant[]> {
  const { data } = await apiClient.get<EduParticipant[]>(`/edu/bookings/${bookingId}/participants`);
  return data;
}

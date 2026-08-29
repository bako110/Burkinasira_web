import { apiClient } from '../../../shared/api/client';
import type { BookingStatus, GuideBooking } from '../types';

export async function fetchMyGuideBookings(statusFilter?: BookingStatus): Promise<GuideBooking[]> {
  const { data } = await apiClient.get<GuideBooking[]>('/guides/me/bookings', {
    params: statusFilter ? { status_filter: statusFilter } : undefined,
  });
  return data;
}

export async function confirmBooking(bookingId: string): Promise<void> {
  await apiClient.post(`/bookings/${bookingId}/confirm`);
}

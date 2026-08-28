import { apiClient } from '../../../shared/api/client';
import type { Booking, BookingStatus, CreateBookingPayload, Invoice } from '../types';

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await apiClient.post<Booking>('/bookings', payload);
  return data;
}

export async function fetchMyBookings(statusFilter?: BookingStatus): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>('/bookings/me', {
    params: statusFilter ? { status_filter: statusFilter } : undefined,
  });
  return data;
}

export async function fetchBookingById(bookingId: string): Promise<Booking> {
  const { data } = await apiClient.get<Booking>(`/bookings/${bookingId}`);
  return data;
}

export async function fetchBookingByReference(reference: string): Promise<Booking> {
  const { data } = await apiClient.get<Booking>(`/bookings/reference/${reference}`);
  return data;
}

export async function cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
  const { data } = await apiClient.post<Booking>(`/bookings/${bookingId}/cancel`, { reason });
  return data;
}

export async function refundBooking(bookingId: string): Promise<Booking> {
  const { data } = await apiClient.post<Booking>(`/bookings/${bookingId}/refund`);
  return data;
}

export async function fetchBookingInvoice(bookingId: string): Promise<Invoice> {
  const { data } = await apiClient.get<Invoice>(`/bookings/${bookingId}/invoice`);
  return data;
}

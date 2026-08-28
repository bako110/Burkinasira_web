import { apiClient } from '../../../shared/api/client';
import type {
  TripSummary,
  TripDetail,
  CreateTripPayload,
  UpdateTripPayload,
  AddTripDayItemPayload,
  RemoveTripDayItemPayload,
} from '../types';

export async function fetchMyTrips(): Promise<TripSummary[]> {
  const { data } = await apiClient.get<TripSummary[]>('/trips/me');
  return data;
}

export async function fetchTrip(tripId: string): Promise<TripDetail> {
  const { data } = await apiClient.get<TripDetail>(`/trips/${tripId}`);
  return data;
}

export async function createTrip(payload: CreateTripPayload): Promise<TripDetail> {
  const { data } = await apiClient.post<TripDetail>('/trips', payload);
  return data;
}

export async function updateTrip(tripId: string, payload: UpdateTripPayload): Promise<TripDetail> {
  const { data } = await apiClient.patch<TripDetail>(`/trips/${tripId}`, payload);
  return data;
}

export async function deleteTrip(tripId: string): Promise<void> {
  await apiClient.delete(`/trips/${tripId}`);
}

export async function addTripDayItem(tripId: string, payload: AddTripDayItemPayload): Promise<TripDetail> {
  const { data } = await apiClient.post<TripDetail>(`/trips/${tripId}/days/items`, payload);
  return data;
}

export async function removeTripDayItem(tripId: string, payload: RemoveTripDayItemPayload): Promise<TripDetail> {
  const { data } = await apiClient.delete<TripDetail>(`/trips/${tripId}/days/items`, { data: payload });
  return data;
}

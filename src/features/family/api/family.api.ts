import { apiClient } from '../../../shared/api/client';
import type {
  BookChildcarePayload,
  ChildcareBooking,
  FamilyServiceDetail,
  FamilyServiceFilters,
  FamilyServiceSummary,
} from '../types';

export interface FamilyServiceListResponse {
  items: FamilyServiceSummary[];
  total: number;
  page: number;
  page_size: number;
}

export async function fetchFamilyServices(
  filters: FamilyServiceFilters = {},
): Promise<FamilyServiceListResponse> {
  const { data } = await apiClient.get<FamilyServiceListResponse>('/family-services', {
    params: filters,
  });
  return data;
}

export async function fetchFamilyServiceById(serviceId: string): Promise<FamilyServiceDetail> {
  const { data } = await apiClient.get<FamilyServiceDetail>(`/family-services/${serviceId}`);
  return data;
}

export async function bookChildcare(payload: BookChildcarePayload): Promise<ChildcareBooking> {
  const { data } = await apiClient.post<ChildcareBooking>('/family-services/childcare-bookings', payload);
  return data;
}

export async function fetchMyChildcareBookings(): Promise<ChildcareBooking[]> {
  const { data } = await apiClient.get<ChildcareBooking[]>('/family-services/childcare-bookings/me');
  return data;
}

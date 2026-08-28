import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { HotelDetail, HotelFilters, HotelSummary } from '../types';

export async function fetchHotels(filters: HotelFilters = {}): Promise<PaginatedResponse<HotelSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<HotelSummary>>('/hotels', {
    params: filters,
  });
  return data;
}

export async function fetchHotelById(hotelId: string): Promise<HotelDetail> {
  const { data } = await apiClient.get<HotelDetail>(`/hotels/${hotelId}`);
  return data;
}

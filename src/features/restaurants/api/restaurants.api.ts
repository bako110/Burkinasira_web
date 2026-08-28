import { apiClient } from '../../../shared/api/client';
import type { PaginatedResponse } from '../../../shared/api/types';
import type { RestaurantDetail, RestaurantFilters, RestaurantSummary } from '../types';

export async function fetchRestaurants(
  filters: RestaurantFilters = {},
): Promise<PaginatedResponse<RestaurantSummary>> {
  const { data } = await apiClient.get<PaginatedResponse<RestaurantSummary>>('/restaurants', {
    params: filters,
  });
  return data;
}

export async function fetchRestaurantById(restaurantId: string): Promise<RestaurantDetail> {
  const { data } = await apiClient.get<RestaurantDetail>(`/restaurants/${restaurantId}`);
  return data;
}

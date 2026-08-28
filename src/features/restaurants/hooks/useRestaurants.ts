import { useQuery } from '@tanstack/react-query';

import { fetchRestaurants } from '../api/restaurants.api';
import type { RestaurantFilters } from '../types';

export function useRestaurants(filters: RestaurantFilters = {}) {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => fetchRestaurants(filters),
  });
}

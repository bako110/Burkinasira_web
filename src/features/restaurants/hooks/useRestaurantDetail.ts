import { useQuery } from '@tanstack/react-query';

import { fetchRestaurantById } from '../api/restaurants.api';

export function useRestaurantDetail(restaurantId: string | undefined) {
  return useQuery({
    queryKey: ['restaurant-detail', restaurantId],
    queryFn: () => fetchRestaurantById(restaurantId!),
    enabled: Boolean(restaurantId),
    retry: false,
  });
}

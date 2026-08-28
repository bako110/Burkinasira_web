import { useQuery } from '@tanstack/react-query';

import { fetchHotels } from '../api/hotels.api';
import type { HotelFilters } from '../types';

export function useHotels(filters: HotelFilters = {}) {
  return useQuery({
    queryKey: ['hotels', filters],
    queryFn: () => fetchHotels(filters),
  });
}

import { useQuery } from '@tanstack/react-query';

import { fetchHotelById } from '../api/hotels.api';

export function useHotelDetail(hotelId: string | undefined) {
  return useQuery({
    queryKey: ['hotel-detail', hotelId],
    queryFn: () => fetchHotelById(hotelId!),
    enabled: Boolean(hotelId),
    retry: false,
  });
}

import { useQueries } from '@tanstack/react-query';

import { fetchHotelById } from '../../hotels/api/hotels.api';

export function useLinkedHotels(ids: string[] | undefined) {
  const queries = useQueries({
    queries: (ids ?? []).map((id) => ({
      queryKey: ['hotel-detail', id],
      queryFn: () => fetchHotelById(id),
      retry: false,
    })),
  });

  return queries.map((q) => q.data).filter((d) => d !== undefined);
}

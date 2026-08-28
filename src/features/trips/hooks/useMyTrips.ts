import { useQuery } from '@tanstack/react-query';

import { fetchMyTrips } from '../api/trips.api';

export function useMyTrips() {
  return useQuery({
    queryKey: ['my-trips'],
    queryFn: fetchMyTrips,
  });
}

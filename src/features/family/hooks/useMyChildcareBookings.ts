import { useQuery } from '@tanstack/react-query';

import { fetchMyChildcareBookings } from '../api/family.api';

export function useMyChildcareBookings() {
  return useQuery({
    queryKey: ['family-my-childcare-bookings'],
    queryFn: fetchMyChildcareBookings,
  });
}

import { useQuery } from '@tanstack/react-query';

import { fetchMyBookings } from '../api/bookings.api';
import type { BookingStatus } from '../types';

export function useMyBookings(statusFilter?: BookingStatus) {
  return useQuery({
    queryKey: ['my-bookings', statusFilter],
    queryFn: () => fetchMyBookings(statusFilter),
  });
}

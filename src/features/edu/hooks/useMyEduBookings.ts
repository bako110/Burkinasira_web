import { useQuery } from '@tanstack/react-query';

import { fetchMyEduBookings } from '../api/edu.api';

export function useMyEduBookings() {
  return useQuery({
    queryKey: ['edu-my-bookings'],
    queryFn: fetchMyEduBookings,
  });
}

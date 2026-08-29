import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMyGuideBookings, confirmBooking } from '../api/guideBookings.api';
import type { BookingStatus } from '../types';

export function useMyGuideBookings(statusFilter?: BookingStatus) {
  return useQuery({
    queryKey: ['my-guide-bookings', statusFilter],
    queryFn: () => fetchMyGuideBookings(statusFilter),
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-guide-bookings'] }),
  });
}

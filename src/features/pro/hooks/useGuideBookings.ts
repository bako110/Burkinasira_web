import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchMyGuideBookings, fetchReceivedBookings, confirmBooking } from '../api/guideBookings.api';
import type { BookingStatus, ProviderItemType } from '../types';

export function useMyGuideBookings(statusFilter?: BookingStatus) {
  return useQuery({
    queryKey: ['my-guide-bookings', statusFilter],
    queryFn: () => fetchMyGuideBookings(statusFilter),
  });
}

export function useReceivedBookings(
  itemType: ProviderItemType,
  itemId: string | undefined,
  statusFilter?: BookingStatus,
) {
  return useQuery({
    queryKey: ['received-bookings', itemType, itemId, statusFilter],
    queryFn: () => fetchReceivedBookings(itemType, itemId as string, statusFilter),
    enabled: Boolean(itemId),
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-guide-bookings'] }),
  });
}

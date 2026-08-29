import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchGuideAvailability, createAvailabilitySlot, deleteAvailabilitySlot } from '../api/availability.api';

export function useGuideAvailability(guideId: string | null, date?: string) {
  return useQuery({
    queryKey: ['my-guide-availability', guideId, date],
    queryFn: () => fetchGuideAvailability(guideId as string, date),
    enabled: !!guideId,
  });
}

export function useCreateAvailabilitySlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAvailabilitySlot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-guide-availability'] }),
  });
}

export function useDeleteAvailabilitySlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAvailabilitySlot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-guide-availability'] }),
  });
}

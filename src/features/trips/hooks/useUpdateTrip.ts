import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateTrip } from '../api/trips.api';
import type { UpdateTripPayload } from '../types';

export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTripPayload) => updateTrip(tripId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['trip', tripId], data);
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addTripDayItem, removeTripDayItem } from '../api/trips.api';
import type { AddTripDayItemPayload, RemoveTripDayItemPayload } from '../types';

export function useAddTripDayItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddTripDayItemPayload) => addTripDayItem(tripId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['trip', tripId], data);
    },
  });
}

export function useRemoveTripDayItem(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveTripDayItemPayload) => removeTripDayItem(tripId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['trip', tripId], data);
    },
  });
}

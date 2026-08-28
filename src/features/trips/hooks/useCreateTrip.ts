import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTrip } from '../api/trips.api';

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bookChildcare } from '../api/family.api';

export function useBookChildcare() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookChildcare,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-my-childcare-bookings'] });
    },
  });
}

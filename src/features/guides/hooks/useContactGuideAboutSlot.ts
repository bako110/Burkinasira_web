import { useMutation, useQueryClient } from '@tanstack/react-query';

import { contactGuideAboutSlot } from '../api/guides.api';

export function useContactGuideAboutSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactGuideAboutSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

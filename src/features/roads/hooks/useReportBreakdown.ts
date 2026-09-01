import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reportBreakdown } from '../api/roads.api';

export function useReportBreakdown() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportBreakdown,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roads-my-breakdowns'] });
    },
  });
}

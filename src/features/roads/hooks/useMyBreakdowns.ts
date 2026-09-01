import { useQuery } from '@tanstack/react-query';

import { fetchMyBreakdowns } from '../api/roads.api';

export function useMyBreakdowns() {
  return useQuery({
    queryKey: ['roads-my-breakdowns'],
    queryFn: fetchMyBreakdowns,
  });
}

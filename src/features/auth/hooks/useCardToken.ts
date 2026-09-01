import { useQuery } from '@tanstack/react-query';

import { fetchCardToken } from '../api/auth.api';

export function useCardToken() {
  return useQuery({
    queryKey: ['card-token'],
    queryFn: fetchCardToken,
    staleTime: Infinity,
  });
}

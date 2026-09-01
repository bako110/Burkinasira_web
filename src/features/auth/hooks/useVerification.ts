import { useQuery } from '@tanstack/react-query';

import { fetchVerification } from '../api/auth.api';

export function useVerification(userId: string | undefined) {
  return useQuery({
    queryKey: ['verification', userId],
    queryFn: () => fetchVerification(userId as string),
    enabled: Boolean(userId),
    retry: false,
  });
}

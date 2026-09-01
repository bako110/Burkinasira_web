import { useQuery } from '@tanstack/react-query';

import { fetchVerification } from '../api/auth.api';

export function useVerification(cardToken: string | undefined) {
  return useQuery({
    queryKey: ['verification', cardToken],
    queryFn: () => fetchVerification(cardToken as string),
    enabled: Boolean(cardToken),
    retry: false,
  });
}

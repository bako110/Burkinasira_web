import { useQuery } from '@tanstack/react-query';

import { fetchMyPassport } from '../api/passport.api';

export function useMyPassport() {
  return useQuery({
    queryKey: ['my-passport'],
    queryFn: fetchMyPassport,
  });
}

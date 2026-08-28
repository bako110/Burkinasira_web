import { useQuery } from '@tanstack/react-query';

import { fetchBadges } from '../api/passport.api';

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: fetchBadges,
  });
}

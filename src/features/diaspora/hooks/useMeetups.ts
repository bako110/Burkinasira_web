import { useQuery } from '@tanstack/react-query';

import { fetchMeetups } from '../api/diaspora.api';

export function useMeetups(region?: string) {
  return useQuery({
    queryKey: ['diaspora-meetups', region],
    queryFn: () => fetchMeetups(region),
  });
}

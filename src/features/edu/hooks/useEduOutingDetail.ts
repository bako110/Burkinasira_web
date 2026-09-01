import { useQuery } from '@tanstack/react-query';

import { fetchEduOutingById } from '../api/edu.api';

export function useEduOutingDetail(outingId: string | undefined) {
  return useQuery({
    queryKey: ['edu-outing-detail', outingId],
    queryFn: () => fetchEduOutingById(outingId!),
    enabled: Boolean(outingId),
    retry: false,
  });
}

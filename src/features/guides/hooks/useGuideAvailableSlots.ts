import { useQuery } from '@tanstack/react-query';

import { fetchGuideAvailableSlots } from '../api/guides.api';

export function useGuideAvailableSlots(guideId: string | undefined) {
  return useQuery({
    queryKey: ['guide-available-slots', guideId],
    queryFn: () => fetchGuideAvailableSlots(guideId!),
    enabled: Boolean(guideId),
  });
}

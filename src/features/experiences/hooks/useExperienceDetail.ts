import { useQuery } from '@tanstack/react-query';

import { fetchExperienceById } from '../api/experiences.api';

export function useExperienceDetail(experienceId: string | undefined) {
  return useQuery({
    queryKey: ['experience-detail', experienceId],
    queryFn: () => fetchExperienceById(experienceId!),
    enabled: Boolean(experienceId),
    retry: false,
  });
}

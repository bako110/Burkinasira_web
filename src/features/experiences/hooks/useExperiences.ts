import { useQuery } from '@tanstack/react-query';

import { fetchExperiences } from '../api/experiences.api';
import type { ExperienceFilters } from '../types';

export function useExperiences(filters: ExperienceFilters = {}) {
  return useQuery({
    queryKey: ['experiences', filters],
    queryFn: () => fetchExperiences(filters),
  });
}

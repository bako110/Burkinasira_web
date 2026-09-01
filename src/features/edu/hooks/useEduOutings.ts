import { useQuery } from '@tanstack/react-query';

import { fetchEduOutings } from '../api/edu.api';
import type { EduOutingFilters } from '../types';

export function useEduOutings(filters: EduOutingFilters = {}) {
  return useQuery({
    queryKey: ['edu-outings', filters],
    queryFn: () => fetchEduOutings(filters),
  });
}

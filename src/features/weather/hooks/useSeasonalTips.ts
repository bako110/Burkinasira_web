import { useQuery } from '@tanstack/react-query';

import { fetchSeasonalTips } from '../api/weather.api';

export function useSeasonalTips(season?: string) {
  return useQuery({
    queryKey: ['seasonal-tips', season],
    queryFn: () => fetchSeasonalTips(season),
  });
}

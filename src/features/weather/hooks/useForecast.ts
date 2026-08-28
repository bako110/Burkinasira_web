import { useQuery } from '@tanstack/react-query';

import { fetchForecast } from '../api/weather.api';

export function useForecast(region: string, days = 5) {
  return useQuery({
    queryKey: ['weather-forecast', region, days],
    queryFn: () => fetchForecast(region, days),
    enabled: Boolean(region),
  });
}

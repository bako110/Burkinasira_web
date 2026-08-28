import { useQuery } from '@tanstack/react-query';

import { fetchCurrentWeather } from '../api/weather.api';

export function useCurrentWeather(region: string) {
  return useQuery({
    queryKey: ['weather-current', region],
    queryFn: () => fetchCurrentWeather(region),
    enabled: Boolean(region),
  });
}

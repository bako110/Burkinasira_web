import { useQuery } from '@tanstack/react-query';

import { fetchWeatherAlerts } from '../api/weather.api';

export function useWeatherAlerts(region?: string) {
  return useQuery({
    queryKey: ['weather-alerts', region],
    queryFn: () => fetchWeatherAlerts(region),
  });
}

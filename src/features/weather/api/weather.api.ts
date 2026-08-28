import { apiClient } from '../../../shared/api/client';
import type { WeatherSnapshot, WeatherAlert, SeasonalTip } from '../types';

export async function fetchCurrentWeather(region: string): Promise<WeatherSnapshot | null> {
  try {
    const { data } = await apiClient.get<WeatherSnapshot>('/weather/current', { params: { region } });
    return data;
  } catch (error) {
    if ((error as { response?: { status?: number } }).response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function fetchForecast(region: string, days = 5): Promise<WeatherSnapshot[]> {
  const { data } = await apiClient.get<WeatherSnapshot[]>('/weather/forecast', { params: { region, days } });
  return data;
}

export async function fetchWeatherAlerts(region?: string): Promise<WeatherAlert[]> {
  const { data } = await apiClient.get<WeatherAlert[]>('/weather/alerts', {
    params: region ? { region } : undefined,
  });
  return data;
}

export async function fetchSeasonalTips(season?: string): Promise<SeasonalTip[]> {
  const { data } = await apiClient.get<SeasonalTip[]>('/weather/seasonal-tips', {
    params: season ? { season } : undefined,
  });
  return data;
}

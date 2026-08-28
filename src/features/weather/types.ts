export interface WeatherSnapshot {
  id: string;
  region: string;
  temperature_celsius?: number;
  condition?: string;
  rain_probability_percent?: number;
  wind_speed_kmh?: number;
  air_quality_index?: number;
  forecast_date: string;
  source?: string;
}

export type WeatherAlertSeverity = 'info' | 'warning' | 'critical';

export interface WeatherAlert {
  id: string;
  region: string;
  title: string;
  description: string;
  severity: WeatherAlertSeverity;
  is_active: boolean;
  created_at: string;
}

export interface SeasonalTip {
  id: string;
  season: string;
  title: string;
  content: string;
}

export const BURKINA_REGIONS = [
  'Boucle du Mouhoun',
  'Cascades',
  'Centre',
  'Centre-Est',
  'Centre-Nord',
  'Centre-Ouest',
  'Centre-Sud',
  'Est',
  'Hauts-Bassins',
  'Nord',
  'Plateau-Central',
  'Sahel',
  'Sud-Ouest',
] as const;

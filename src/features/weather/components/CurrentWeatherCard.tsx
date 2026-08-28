import { useTranslation } from 'react-i18next';
import { Thermometer, Droplets, Wind, Gauge } from 'lucide-react';

import type { WeatherSnapshot } from '../types';
import styles from './CurrentWeatherCard.module.css';

export function CurrentWeatherCard({ snapshot }: { snapshot: WeatherSnapshot }) {
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <div className={styles.main}>
        {typeof snapshot.temperature_celsius === 'number' && (
          <span className={styles.temperature}>{Math.round(snapshot.temperature_celsius)}°C</span>
        )}
        {snapshot.condition && <span className={styles.condition}>{snapshot.condition}</span>}
      </div>
      <div className={styles.metrics}>
        {typeof snapshot.rain_probability_percent === 'number' && (
          <span className={styles.metric}>
            <Droplets size={15} strokeWidth={2} />
            {t('weather.rainChance', { percent: Math.round(snapshot.rain_probability_percent) })}
          </span>
        )}
        {typeof snapshot.wind_speed_kmh === 'number' && (
          <span className={styles.metric}>
            <Wind size={15} strokeWidth={2} />
            {Math.round(snapshot.wind_speed_kmh)} km/h
          </span>
        )}
        {typeof snapshot.air_quality_index === 'number' && (
          <span className={styles.metric}>
            <Gauge size={15} strokeWidth={2} />
            {t('weather.airQuality')}: {Math.round(snapshot.air_quality_index)}
          </span>
        )}
        {typeof snapshot.temperature_celsius !== 'number' && (
          <span className={styles.metric}>
            <Thermometer size={15} strokeWidth={2} />
            {t('weather.noData')}
          </span>
        )}
      </div>
    </div>
  );
}

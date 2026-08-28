import { useTranslation } from 'react-i18next';
import { Droplets } from 'lucide-react';

import type { WeatherSnapshot } from '../types';
import styles from './ForecastStrip.module.css';

export function ForecastStrip({ items }: { items: WeatherSnapshot[] }) {
  const { i18n } = useTranslation();

  return (
    <div className={styles.strip}>
      {items.map((item) => {
        const date = new Date(item.forecast_date);
        return (
          <div key={item.id} className={styles.day}>
            <span className={styles.dayLabel}>
              {date.toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric' })}
            </span>
            {typeof item.temperature_celsius === 'number' && (
              <span className={styles.temp}>{Math.round(item.temperature_celsius)}°C</span>
            )}
            {item.condition && <span className={styles.condition}>{item.condition}</span>}
            {typeof item.rain_probability_percent === 'number' && (
              <span className={styles.rain}>
                <Droplets size={13} strokeWidth={2} />
                {Math.round(item.rain_probability_percent)}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudSun } from 'lucide-react';

import { Spinner, Reveal, EmptyResults, RelatedModules } from '../../../shared/ui';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import { useForecast } from '../hooks/useForecast';
import { useWeatherAlerts } from '../hooks/useWeatherAlerts';
import { useSeasonalTips } from '../hooks/useSeasonalTips';
import { CurrentWeatherCard } from '../components/CurrentWeatherCard';
import { ForecastStrip } from '../components/ForecastStrip';
import { WeatherAlertBanner } from '../components/WeatherAlertBanner';
import { BURKINA_REGIONS } from '../types';
import styles from './WeatherPage.module.css';

export function WeatherPage() {
  const { t } = useTranslation();
  const [region, setRegion] = useState<string>(BURKINA_REGIONS[2]);

  const { data: current, isLoading: isLoadingCurrent } = useCurrentWeather(region);
  const { data: forecast, isLoading: isLoadingForecast } = useForecast(region, 5);
  const { data: alerts } = useWeatherAlerts(region);
  const { data: tips } = useSeasonalTips();

  const activeAlerts = alerts?.filter((a) => a.is_active) ?? [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <CloudSun size={28} strokeWidth={1.75} />
          </span>
          <h1 className={styles.heroTitle}>{t('weather.title')}</h1>
          <p className={styles.heroSubtitle}>{t('weather.subtitle')}</p>

          <select
            className={styles.regionSelect}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label={t('weather.regionLabel')}
          >
            {BURKINA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </section>

      <div className={styles.body}>
        {activeAlerts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('weather.alertsTitle')}</h2>
            <div className={styles.alertList}>
              {activeAlerts.map((alert, i) => (
                <Reveal key={alert.id} delay={i * 60}>
                  <WeatherAlertBanner alert={alert} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('weather.currentTitle')}</h2>
          {isLoadingCurrent && (
            <div className={styles.center}>
              <Spinner size={24} />
            </div>
          )}
          {!isLoadingCurrent && current && <CurrentWeatherCard snapshot={current} />}
          {!isLoadingCurrent && !current && (
            <EmptyResults variant="empty" title={t('weather.noDataForRegion')} text={t('explore.emptyText')} />
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('weather.forecastTitle')}</h2>
          {isLoadingForecast && (
            <div className={styles.center}>
              <Spinner size={24} />
            </div>
          )}
          {!isLoadingForecast && forecast && forecast.length > 0 && <ForecastStrip items={forecast} />}
          {!isLoadingForecast && (!forecast || forecast.length === 0) && (
            <EmptyResults variant="empty" title={t('weather.noForecast')} text={t('explore.emptyText')} />
          )}
        </section>

        {tips && tips.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('weather.tipsTitle')}</h2>
            <div className={styles.tipsList}>
              {tips.map((tip, i) => (
                <Reveal key={tip.id} delay={i * 60}>
                  <div className={styles.tipCard}>
                    <span className={styles.tipSeason}>{tip.season}</span>
                    <p className={styles.tipTitle}>{tip.title}</p>
                    <p className={styles.tipContent}>{tip.content}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <RelatedModules currentPath="/weather" />
      </div>
    </div>
  );
}

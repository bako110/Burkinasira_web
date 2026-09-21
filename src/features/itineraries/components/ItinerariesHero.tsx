import { useTranslation } from 'react-i18next';
import { Route } from 'lucide-react';

import { DetailBackButton } from '../../../shared/ui';
import styles from './ItinerariesHero.module.css';

interface ItinerariesHeroProps {
  /** Nombre d'itinéraires publiés. */
  count: number;
  /** Nombre de régions couvertes. */
  regionCount: number;
  /** Nombre total de jours programmés. */
  dayCount: number;
}

/**
 * Hero éditorial dédié au listing d'itinéraires : dégradé savane, badge et
 * bandeau de repères chiffrés (parcours, régions, jours).
 */
export function ItinerariesHero({ count, regionCount, dayCount }: ItinerariesHeroProps) {
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className={styles.pattern} aria-hidden="true" />
      <DetailBackButton fallbackTo="/" className={styles.backBtn} />

      <div className={styles.content}>
        <span className={styles.badge}>
          <Route size={13} strokeWidth={2} aria-hidden="true" />
          {t('itineraries.kicker')}
        </span>

        <h1 className={styles.title}>{t('itineraries.title')}</h1>
        <p className={styles.subtitle}>{t('itineraries.subtitle')}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{count}</span>
            <span className={styles.statLabel}>{t('itineraries.statRoutes')}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{regionCount}</span>
            <span className={styles.statLabel}>{t('itineraries.statRegions')}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{dayCount}</span>
            <span className={styles.statLabel}>{t('itineraries.statDays')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

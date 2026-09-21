import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Reveal } from '../../../shared/ui/Reveal';
import { useDestinations } from '../../destinations/hooks/useDestinations';
import { DestinationCard } from '../../destinations/components/DestinationCard';
import styles from './FeaturedDestinations.module.css';

export function FeaturedDestinations() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useDestinations({ page_size: 6 });

  const hasItems = data && data.items.length > 0;

  return (
    <section className={styles.section}>
      <Reveal className={styles.headingRow}>
        <div className={styles.headingCol}>
          <span className={styles.kicker}>{t('home.featuredTitle')}</span>
          <h2 className={styles.heading}>{t('home.featuredSubtitle')}</h2>
        </div>
        <Link to="/explore" className={styles.seeAll}>
          {t('common.seeAll')}
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
      </Reveal>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {(isError || (!isLoading && !hasItems)) && (
        <Reveal className={styles.emptyState}>
          <p>{t('home.featuredUnavailable')}</p>
          <Link to="/explore" className={styles.emptyCta}>
            {t('nav.explore')}
          </Link>
        </Reveal>
      )}

      {hasItems && (
        <div className={styles.grid}>
          {data.items.map((destination, i) => (
            <Reveal key={destination.id} delay={i * 80} className={styles.gridItem}>
              <DestinationCard destination={destination} imageFit={i === 0 ? 'fill' : 'ratio'} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

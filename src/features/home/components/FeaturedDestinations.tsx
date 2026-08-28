import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Reveal } from '../../../shared/ui/Reveal';
import { FloatingFlags } from '../../../shared/ui';
import { useDestinations } from '../../destinations/hooks/useDestinations';
import { DestinationCard } from '../../destinations/components/DestinationCard';
import styles from './FeaturedDestinations.module.css';

export function FeaturedDestinations() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useDestinations({ page_size: 6 });

  const hasItems = data && data.items.length > 0;

  return (
    <section className={styles.section}>
      <FloatingFlags tone="subtle" />
      <Reveal className={styles.headingRow}>
        <div>
          <h2 className={styles.heading}>{t('home.featuredTitle')}</h2>
          <p className={styles.subheading}>{t('home.featuredSubtitle')}</p>
        </div>
        <Link to="/explore" className={styles.seeAll}>
          {t('common.seeAll')} →
        </Link>
      </Reveal>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
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
            <Reveal key={destination.id} delay={i * 80}>
              <DestinationCard destination={destination} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

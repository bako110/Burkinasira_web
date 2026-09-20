import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Gauge, ArrowRight, Sparkles } from 'lucide-react';

import { Reveal, RelatedModules } from '../../../shared/ui';
import { useLocalizedItineraries } from '../itineraries.i18n';
import { ItineraryCover } from '../components/ItineraryCover';
import { ItinerariesHero } from '../components/ItinerariesHero';
import { formatXof } from '../../planner/budget';
import styles from './ItinerariesPage.module.css';

export function ItinerariesPage() {
  const { t } = useTranslation();
  const itineraries = useLocalizedItineraries();

  const featured = itineraries[0];
  const rest = itineraries.slice(1);
  const regionCount = new Set(itineraries.map((it) => it.region)).size;
  const dayCount = itineraries.reduce((sum, it) => sum + it.durationDays, 0);

  return (
    <div className={styles.page}>
      <ItinerariesHero count={itineraries.length} regionCount={regionCount} dayCount={dayCount} />

      <div className={styles.body}>
        {featured && (
          <Reveal as="section" className={styles.featuredSection}>
            <header className={styles.sectionHead}>
              <span className={styles.sectionKicker}>
                <Sparkles size={13} strokeWidth={2} />
                {t('itineraries.featuredKicker')}
              </span>
              <h2 className={styles.sectionTitle}>{t('itineraries.featuredTitle')}</h2>
            </header>

            <Link to={`/itineraries/${featured.slug}`} className={styles.featured}>
              <div className={styles.featuredCover}>
                <ItineraryCover theme={featured.coverTheme} />
                <span className={styles.cardDuration}>
                  <Clock size={13} strokeWidth={2} />
                  {t('itineraries.days', { count: featured.durationDays })}
                </span>
              </div>

              <div className={styles.featuredBody}>
                <span className={styles.featuredRegion}>
                  <MapPin size={13} strokeWidth={2} />
                  {featured.region}
                </span>
                <h3 className={styles.featuredTitle}>{featured.title}</h3>
                <p className={styles.featuredTagline}>{featured.tagline}</p>

                <ul className={styles.cardHighlights}>
                  {featured.highlights.slice(0, 4).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>

                <div className={styles.cardMeta}>
                  <span>
                    <Gauge size={13} strokeWidth={2} />
                    {t(`itineraries.pace.${featured.pace}`)}
                  </span>
                  <span>
                    <Users size={13} strokeWidth={2} />
                    {featured.audience[0]}
                  </span>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardPrice}>
                    {t('itineraries.fromPerPerson', {
                      amount: formatXof(featured.budgetFrom.standard),
                    })}
                  </span>
                  <span className={styles.cardCta}>
                    {t('itineraries.discover')}
                    <ArrowRight size={15} strokeWidth={2} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {rest.length > 0 && (
          <section className={styles.listSection}>
            <header className={styles.sectionHead}>
              <span className={styles.sectionKicker}>{t('itineraries.allKicker')}</span>
              <h2 className={styles.sectionTitle}>{t('itineraries.allTitle')}</h2>
            </header>

            <div className={styles.grid}>
              {rest.map((it, i) => (
                <Reveal key={it.slug} delay={Math.min(i, 6) * 70}>
                  <Link to={`/itineraries/${it.slug}`} className={styles.card}>
                    <div className={styles.cardCover}>
                      <ItineraryCover theme={it.coverTheme} />
                      <span className={styles.cardDuration}>
                        <Clock size={13} strokeWidth={2} />
                        {t('itineraries.days', { count: it.durationDays })}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{it.title}</h3>
                      <p className={styles.cardTagline}>{it.tagline}</p>

                      <div className={styles.cardMeta}>
                        <span>
                          <MapPin size={13} strokeWidth={2} />
                          {it.region}
                        </span>
                        <span>
                          <Gauge size={13} strokeWidth={2} />
                          {t(`itineraries.pace.${it.pace}`)}
                        </span>
                        <span>
                          <Users size={13} strokeWidth={2} />
                          {it.audience[0]}
                        </span>
                      </div>

                      <ul className={styles.cardHighlights}>
                        {it.highlights.slice(0, 3).map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>

                      <div className={styles.cardFooter}>
                        <span className={styles.cardPrice}>
                          {t('itineraries.fromPerPerson', {
                            amount: formatXof(it.budgetFrom.standard),
                          })}
                        </span>
                        <span className={styles.cardCta}>
                          {t('itineraries.discover')}
                          <ArrowRight size={15} strokeWidth={2} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <p className={styles.note}>{t('itineraries.note')}</p>
      </div>

      <RelatedModules currentPath="/itineraries" />
    </div>
  );
}

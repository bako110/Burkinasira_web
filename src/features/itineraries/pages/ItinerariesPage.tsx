import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Users, Gauge, ArrowRight } from 'lucide-react';

import { Reveal } from '../../../shared/ui';
import { ITINERARIES } from '../itineraries.data';
import { formatXof } from '../../planner/budget';
import styles from './ItinerariesPage.module.css';

export function ItinerariesPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.kicker}>{t('itineraries.kicker')}</span>
          <h1 className={styles.title}>{t('itineraries.title')}</h1>
          <p className={styles.subtitle}>{t('itineraries.subtitle')}</p>
        </div>
      </section>

      <div className={styles.grid}>
        {ITINERARIES.map((it, i) => (
          <Reveal key={it.slug} delay={Math.min(i, 6) * 70}>
            <Link to={`/itineraries/${it.slug}`} className={styles.card}>
              <div
                className={styles.cardCover}
                style={{ backgroundImage: `url(${it.cover})` }}
                aria-hidden="true"
              >
                <span className={styles.cardDuration}>
                  <Clock size={13} strokeWidth={2} />
                  {t('itineraries.days', { count: it.durationDays })}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{it.title}</h2>
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

      <p className={styles.note}>{t('itineraries.note')}</p>
    </div>
  );
}

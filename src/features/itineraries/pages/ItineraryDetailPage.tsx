import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Users,
  Gauge,
  CalendarRange,
  Wallet,
  Check,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';

import { getItineraryBySlug } from '../itineraries.data';
import { ItineraryCover } from '../components/ItineraryCover';
import { useCloneItinerary } from '../useCloneItinerary';
import { formatXof, type ComfortLevel } from '../../planner/budget';
import { TravelAdvice } from '../../planner/components/TravelAdvice';
import styles from './ItineraryDetailPage.module.css';

const COMFORT_LEVELS: ComfortLevel[] = ['eco', 'standard', 'confort'];

export function ItineraryDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const push = useToastStore((s) => s.push);
  const { clone, isCloning } = useCloneItinerary();

  const itinerary = getItineraryBySlug(slug);
  const [comfort, setComfort] = useState<ComfortLevel>('standard');

  if (!itinerary) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults variant="empty" title={t('itineraries.notFound')} />
        <Button variant="ghost" onClick={() => navigate('/itineraries')}>
          {t('itineraries.title')}
        </Button>
      </div>
    );
  }

  function handleClone() {
    if (!itinerary) return;
    requireAuth(() => {
      clone(itinerary)
        .then((trip) => {
          push({ variant: 'success', message: t('itineraries.cloned') });
          navigate(`/trips/${trip.id}/plan`);
        })
        .catch((err) => {
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        });
    }, t('itineraries.cloneRequiresAuth'));
  }

  const budget = itinerary.budgetFrom[comfort];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <ItineraryCover theme={itinerary.coverTheme} className={styles.heroCover} />
        <div className={styles.heroScrim} aria-hidden="true" />
        <DetailBackButton fallbackTo="/itineraries" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.kicker}>
            <Sparkles size={13} strokeWidth={2} />
            {t('itineraries.kicker')}
          </span>
          <h1 className={styles.title}>{itinerary.title}</h1>
          <p className={styles.tagline}>{itinerary.tagline}</p>
          <div className={styles.heroMeta}>
            <span>
              <Clock size={14} strokeWidth={2} />
              {t('itineraries.days', { count: itinerary.durationDays })}
            </span>
            <span>
              <MapPin size={14} strokeWidth={2} />
              {itinerary.region}
            </span>
            <span>
              <Gauge size={14} strokeWidth={2} />
              {t(`itineraries.pace.${itinerary.pace}`)}
            </span>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.mainCol}>
          <p className={styles.intro}>{itinerary.intro}</p>

          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <Users size={16} strokeWidth={2} />
              <div>
                <span className={styles.infoLabel}>{t('itineraries.forWho')}</span>
                <p className={styles.infoValue}>{itinerary.audience.join(' · ')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <CalendarRange size={16} strokeWidth={2} />
              <div>
                <span className={styles.infoLabel}>{t('itineraries.bestSeason')}</span>
                <p className={styles.infoValue}>{itinerary.bestSeason}</p>
              </div>
            </div>
          </div>

          <section className={styles.highlightsBlock}>
            <h2 className={styles.blockTitle}>{t('itineraries.highlightsTitle')}</h2>
            <ul className={styles.highlightsList}>
              {itinerary.highlights.map((h) => (
                <li key={h}>
                  <Check size={15} strokeWidth={2.5} />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          {/* Programme jour par jour */}
          <section className={styles.programme}>
            <h2 className={styles.blockTitle}>{t('itineraries.programmeTitle')}</h2>
            <div className={styles.days}>
              {itinerary.days.map((day, di) => (
                <article key={di} className={styles.day}>
                  <header className={styles.dayHeader}>
                    <span className={styles.dayNum}>{di + 1}</span>
                    <div>
                      <h3 className={styles.dayTitle}>{day.title}</h3>
                      <p className={styles.daySummary}>{day.summary}</p>
                    </div>
                  </header>

                  <ol className={styles.stops}>
                    {day.stops.map((stop, si) => (
                      <li key={si} className={styles.stop}>
                        <div className={styles.stopSide}>
                          {stop.time && <span className={styles.stopTime}>{stop.time}</span>}
                          <span className={styles.stopType}>{t(`trips.itemTypes.${stop.type}`)}</span>
                        </div>
                        <div className={styles.stopMain}>
                          <p className={styles.stopTitle}>
                            {stop.destinationSlug ? (
                              <Link to={`/explore/${stop.destinationSlug}`} className={styles.stopLink}>
                                {stop.title}
                                <ArrowRight size={13} strokeWidth={2} />
                              </Link>
                            ) : (
                              stop.title
                            )}
                            {typeof stop.estimatedCost === 'number' && stop.estimatedCost > 0 && (
                              <span className={styles.stopCost}>{formatXof(stop.estimatedCost)}</span>
                            )}
                          </p>
                          <p className={styles.stopDesc}>{stop.description}</p>
                          {stop.tip && (
                            <p className={styles.stopTip}>
                              <Lightbulb size={13} strokeWidth={2} />
                              {stop.tip}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.notIncluded}>
            <h2 className={styles.blockTitle}>{t('itineraries.notIncludedTitle')}</h2>
            <ul>
              {itinerary.notIncluded.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </section>

          <div className={styles.adviceMobile}>
            <TravelAdvice collapsedByDefault />
          </div>
        </div>

        {/* Colonne latérale : budget + CTA */}
        <aside className={styles.sideCol}>
          <div className={styles.bookCard}>
            <div className={styles.bookHeader}>
              <Wallet size={16} strokeWidth={2} />
              <span>{t('itineraries.budgetTitle')}</span>
            </div>

            <div className={styles.comfortGroup}>
              {COMFORT_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={lvl === comfort ? styles.comfortChipActive : styles.comfortChip}
                  onClick={() => setComfort(lvl)}
                >
                  {t(`planner.comfortLevels.${lvl}`)}
                </button>
              ))}
            </div>

            <p className={styles.bookAmount}>
              {t('itineraries.fromPerPerson', { amount: formatXof(budget) })}
            </p>
            <p className={styles.bookHint}>{t('itineraries.budgetHint')}</p>

            <Button fullWidth onClick={handleClone} disabled={isCloning}>
              {isCloning ? <Spinner size={16} /> : t('itineraries.cloneCta')}
            </Button>
            <p className={styles.bookNote}>{t('itineraries.cloneNote')}</p>
          </div>

          <div className={styles.adviceDesktop}>
            <TravelAdvice collapsedByDefault />
          </div>
        </aside>
      </div>
    </div>
  );
}

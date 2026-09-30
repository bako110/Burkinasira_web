import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Plane, Luggage } from 'lucide-react';
import clsx from 'clsx';

import { Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyTrips } from '../hooks/useMyTrips';
import { TripCard } from '../components/TripCard';
import { CreateTripModal } from '../components/CreateTripModal';
import { getTripTiming, type TripPhase } from '../timing';
import styles from './MyTripsPage.module.css';

type Filter = 'all' | TripPhase;

const FILTERS: Filter[] = ['all', 'upcoming', 'ongoing', 'past', 'draft'];

export function MyTripsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyTrips();
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const trips = useMemo(() => data ?? [], [data]);

  // Phase de chaque voyage, calculée une seule fois par chargement.
  const withPhase = useMemo(() => trips.map((trip) => ({ trip, phase: getTripTiming(trip).phase })), [trips]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: withPhase.length, upcoming: 0, ongoing: 0, past: 0, draft: 0 };
    withPhase.forEach(({ phase }) => {
      c[phase] += 1;
    });
    return c;
  }, [withPhase]);

  // Voyage mis en avant : celui en cours, sinon le prochain à partir (date de début la plus proche).
  const featuredId = useMemo(() => {
    if (filter !== 'all') return undefined;
    const ongoing = withPhase.find(({ phase }) => phase === 'ongoing');
    if (ongoing) return ongoing.trip.id;
    const upcoming = withPhase
      .filter(({ phase, trip }) => phase === 'upcoming' && trip.start_date)
      .sort((a, b) => (a.trip.start_date ?? '').localeCompare(b.trip.start_date ?? ''));
    return upcoming[0]?.trip.id;
  }, [withPhase, filter]);

  const visible = useMemo(() => {
    const list = filter === 'all' ? withPhase : withPhase.filter(({ phase }) => phase === filter);
    const featured = list.find(({ trip }) => trip.id === featuredId);
    return featured ? [featured, ...list.filter((x) => x !== featured)] : list;
  }, [withPhase, filter, featuredId]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroOrb} aria-hidden="true" />
        <DetailBackButton fallbackTo="/profile" className={styles.backBtn} />

        <div className={styles.heroContent}>
          <span className={styles.kicker}>{t('trips.kicker')}</span>
          <h1 className={styles.title}>{t('trips.myTripsTitle')}</h1>
          {!isLoading && !isError && trips.length > 0 && (
            <div className={styles.heroStats}>
              <span className={styles.statChip}>
                <Luggage size={14} strokeWidth={2} />
                {t('trips.list.total', { count: counts.all })}
              </span>
              {counts.upcoming > 0 && (
                <span className={styles.statChip}>{t('trips.list.upcomingCount', { count: counts.upcoming })}</span>
              )}
              {counts.ongoing > 0 && (
                <span className={clsx(styles.statChip, styles.statChipLive)}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  {t('trips.list.ongoingCount', { count: counts.ongoing })}
                </span>
              )}
            </div>
          )}
          <button type="button" className={styles.createBtn} onClick={() => setCreateOpen(true)}>
            <Plus size={18} strokeWidth={2.25} />
            {t('trips.createCta')}
          </button>
        </div>
      </section>

      <div className={styles.body}>
        {trips.length > 0 && (
          <div className={styles.filters} role="tablist" aria-label={t('trips.list.filters')}>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={clsx(styles.filterTab, filter === f && styles.filterTabActive)}
                onClick={() => setFilter(f)}
                disabled={f !== 'all' && counts[f] === 0}
              >
                {t(`trips.list.filter.${f}`)}
                <span className={styles.filterCount}>{counts[f]}</span>
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

        {!isLoading && !isError && trips.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Plane size={30} strokeWidth={1.5} />
            </span>
            <h2 className={styles.emptyTitle}>{t('trips.empty')}</h2>
            <p className={styles.emptyText}>{t('trips.emptyText')}</p>
            <button type="button" className={styles.emptyBtn} onClick={() => setCreateOpen(true)}>
              <Plus size={16} strokeWidth={2.25} />
              {t('trips.createCta')}
            </button>
          </div>
        )}

        {!isLoading && !isError && visible.length > 0 && (
          // La clé change avec le filtre : la grille rejoue son animation d'entrée à chaque changement.
          <div key={filter} className={styles.grid}>
            {visible.map(({ trip }, i) => (
              <Reveal key={trip.id} delay={Math.min(i, 8) * 50} className={trip.id === featuredId ? styles.featuredCell : undefined}>
                <TripCard trip={trip} featured={trip.id === featuredId} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <CreateTripModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

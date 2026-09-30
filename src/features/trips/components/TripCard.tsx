import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Wallet, ArrowUpRight, Clock, CalendarX2 } from 'lucide-react';
import clsx from 'clsx';

import type { TripSummary } from '../types';
import { getTripTiming } from '../timing';
import styles from './TripCard.module.css';

const PHASE_TONE = {
  draft: 'phaseDraft',
  upcoming: 'phaseUpcoming',
  ongoing: 'phaseOngoing',
  past: 'phasePast',
} as const;

interface TripCardProps {
  trip: TripSummary;
  /** Met le voyage en avant (prochain voyage / voyage en cours). */
  featured?: boolean;
}

export function TripCard({ trip, featured = false }: TripCardProps) {
  const { t, i18n } = useTranslation();
  const timing = getTripTiming(trip);
  const start = trip.start_date ? new Date(trip.start_date) : null;

  const badge =
    timing.phase === 'ongoing'
      ? t('trips.list.badgeOngoing')
      : timing.phase === 'upcoming' && timing.daysUntil !== undefined
        ? t('trips.list.badgeIn', { count: timing.daysUntil })
        : t(`trips.status.${trip.status}`);

  return (
    <Link to={`/trips/${trip.id}`} className={clsx(styles.link, featured && styles.linkFeatured)}>
      <article className={clsx(styles.card, styles[PHASE_TONE[timing.phase]], featured && styles.cardFeatured)}>
        <div className={styles.top}>
          {start ? (
            <span className={styles.dateBlock} aria-hidden="true">
              <span className={styles.dateDay}>{start.toLocaleDateString(i18n.language, { day: '2-digit' })}</span>
              <span className={styles.dateMonth}>
                {start.toLocaleDateString(i18n.language, { month: 'short' }).replace('.', '')}
              </span>
            </span>
          ) : (
            <span className={clsx(styles.dateBlock, styles.dateBlockEmpty)} aria-hidden="true">
              <CalendarX2 size={22} strokeWidth={1.75} />
            </span>
          )}

          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            {badge}
          </span>
        </div>

        {featured && (
          <span className={styles.featuredLabel}>
            {timing.phase === 'ongoing' ? t('trips.list.featuredOngoing') : t('trips.list.featuredNext')}
          </span>
        )}

        <h3 className={styles.title}>{trip.title}</h3>

        {trip.themes.length > 0 && (
          <div className={styles.themes}>
            {trip.themes.map((theme) => (
              <span key={theme} className={styles.themeTag}>
                {t(`trips.themes.${theme}`)}
              </span>
            ))}
          </div>
        )}

        <div className={styles.meta}>
          {trip.region && (
            <span className={styles.metaItem}>
              <MapPin size={14} strokeWidth={2} />
              {trip.region}
            </span>
          )}
          {timing.duration !== undefined && (
            <span className={styles.metaItem}>
              <Clock size={14} strokeWidth={2} />
              {t('trips.list.duration', { count: timing.duration })}
            </span>
          )}
          {typeof trip.budget_estimate === 'number' && (
            <span className={styles.metaItem}>
              <Wallet size={14} strokeWidth={2} />
              {trip.budget_estimate.toLocaleString('fr-FR')} {trip.currency}
            </span>
          )}
        </div>

        <span className={styles.openArrow} aria-hidden="true">
          <ArrowUpRight size={18} strokeWidth={2} />
        </span>
      </article>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Wallet } from 'lucide-react';
import clsx from 'clsx';

import { Card } from '../../../shared/ui';
import type { TripSummary } from '../types';
import styles from './TripCard.module.css';

const STATUS_TONE: Record<TripSummary['status'], string> = {
  draft: 'toneDraft',
  planned: 'tonePlanned',
  in_progress: 'toneInProgress',
  completed: 'toneCompleted',
  cancelled: 'toneCancelled',
};

export function TripCard({ trip }: { trip: TripSummary }) {
  const { t, i18n } = useTranslation();

  return (
    <Link to={`/trips/${trip.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <span className={clsx(styles.status, styles[STATUS_TONE[trip.status]])}>
            {t(`trips.status.${trip.status}`)}
          </span>
        </div>

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
          {trip.start_date && (
            <span className={styles.metaItem}>
              <Calendar size={14} strokeWidth={2} />
              {new Date(trip.start_date).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' })}
              {trip.end_date &&
                ` – ${new Date(trip.end_date).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' })}`}
            </span>
          )}
          {typeof trip.budget_estimate === 'number' && (
            <span className={styles.metaItem}>
              <Wallet size={14} strokeWidth={2} />
              {trip.budget_estimate.toLocaleString('fr-FR')} {trip.currency}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

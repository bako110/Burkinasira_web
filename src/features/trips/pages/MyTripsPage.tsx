import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { Button, Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyTrips } from '../hooks/useMyTrips';
import { TripCard } from '../components/TripCard';
import { CreateTripModal } from '../components/CreateTripModal';
import styles from './MyTripsPage.module.css';

export function MyTripsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyTrips();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{t('trips.myTripsTitle')}</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} />
          {t('trips.createCta')}
        </Button>
      </div>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('trips.empty')} text={t('trips.emptyText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((trip, i) => (
            <Reveal key={trip.id} delay={Math.min(i, 8) * 50}>
              <TripCard trip={trip} />
            </Reveal>
          ))}
        </div>
      )}

      <CreateTripModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

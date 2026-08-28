import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, MapPin, Wallet, Calendar } from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults, DetailBackButton, Input } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useTripDetail } from '../hooks/useTripDetail';
import { useDeleteTrip } from '../hooks/useDeleteTrip';
import { useRemoveTripDayItem } from '../hooks/useTripDayItems';
import { AddDayItemModal } from '../components/AddDayItemModal';
import { DeleteTripDialog } from '../components/DeleteTripDialog';
import type { TripStatus } from '../types';
import styles from './TripDetailPage.module.css';

const STATUS_TONE: Record<TripStatus, string> = {
  draft: 'toneDraft',
  planned: 'tonePlanned',
  in_progress: 'toneInProgress',
  completed: 'toneCompleted',
  cancelled: 'toneCancelled',
};

export function TripDetailPage() {
  const { t, i18n } = useTranslation();
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);

  const { data: trip, isLoading, isError, refetch } = useTripDetail(tripId);
  const { mutate: deleteTrip, isPending: isDeleting } = useDeleteTrip();
  const { mutate: removeItem } = useRemoveTripDayItem(tripId ?? '');

  const [addItemDate, setAddItemDate] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newDayDate, setNewDayDate] = useState('');

  function handleDelete() {
    if (!tripId) return;
    deleteTrip(tripId, {
      onSuccess: () => {
        push({ variant: 'success', message: t('trips.deleteSuccess') });
        navigate('/trips');
      },
      onError: (err) => {
        push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        setDeleteOpen(false);
      },
    });
  }

  function handleRemoveItem(date: string, itemIndex: number) {
    removeItem(
      { date, item_index: itemIndex },
      {
        onSuccess: () => push({ variant: 'success', message: t('trips.itemRemoved') }),
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !trip) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('trips.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/trips')}>
          {t('trips.myTripsTitle')}
        </Button>
      </div>
    );
  }

  const totalEstimated = trip.days.reduce(
    (sum, day) => sum + day.items.reduce((daySum, item) => daySum + (item.estimated_cost ?? 0), 0),
    0,
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/trips" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={clsx(styles.status, styles[STATUS_TONE[trip.status]])}>
            {t(`trips.status.${trip.status}`)}
          </span>
          <h1 className={styles.title}>{trip.title}</h1>
          <div className={styles.heroMeta}>
            {trip.region && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {trip.region}
              </span>
            )}
            {trip.start_date && (
              <span className={styles.metaItem}>
                <Calendar size={14} strokeWidth={2} />
                {new Date(trip.start_date).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long' })}
                {trip.end_date &&
                  ` – ${new Date(trip.end_date).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long' })}`}
              </span>
            )}
            {typeof trip.budget_estimate === 'number' && (
              <span className={styles.metaItem}>
                <Wallet size={14} strokeWidth={2} />
                {t('trips.budgetOf', {
                  spent: totalEstimated.toLocaleString('fr-FR'),
                  total: trip.budget_estimate.toLocaleString('fr-FR'),
                  currency: trip.currency,
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.actionsRow}>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 size={15} strokeWidth={2} />
            {t('trips.deleteTrip')}
          </Button>
        </div>

        <div className={styles.addDayRow}>
          <Input
            type="date"
            className={styles.addDayInput}
            value={newDayDate}
            onChange={(e) => setNewDayDate(e.target.value)}
            aria-label={t('trips.addDayLabel')}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => newDayDate && setAddItemDate(newDayDate)}
            disabled={!newDayDate}
          >
            <Plus size={15} strokeWidth={2} />
            {t('trips.addDayCta')}
          </Button>
        </div>

        {trip.days.length === 0 && (
          <EmptyResults variant="empty" title={t('trips.noDays')} text={t('trips.noDaysText')} />
        )}

        <div className={styles.daysList}>
          {trip.days.map((day) => (
            <div key={day.date} className={styles.dayCard}>
              <div className={styles.dayHeader}>
                <h2 className={styles.dayTitle}>
                  {new Date(day.date).toLocaleDateString(i18n.language, {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setAddItemDate(day.date)}>
                  <Plus size={15} strokeWidth={2} />
                  {t('trips.addItemCta')}
                </Button>
              </div>

              {day.items.length === 0 ? (
                <p className={styles.dayEmpty}>{t('trips.dayEmpty')}</p>
              ) : (
                <div className={styles.itemsList}>
                  {day.items.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <div className={styles.itemMain}>
                        {item.time && <span className={styles.itemTime}>{item.time}</span>}
                        <div>
                          <p className={styles.itemTitle}>{item.title}</p>
                          <span className={styles.itemType}>{t(`trips.itemTypes.${item.type}`)}</span>
                          {item.notes && <p className={styles.itemNotes}>{item.notes}</p>}
                        </div>
                      </div>
                      <div className={styles.itemActions}>
                        {typeof item.estimated_cost === 'number' && (
                          <span className={styles.itemCost}>
                            {item.estimated_cost.toLocaleString('fr-FR')} {trip.currency}
                          </span>
                        )}
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => handleRemoveItem(day.date, idx)}
                          aria-label={t('trips.removeItem')}
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AddDayItemModal
        tripId={tripId ?? ''}
        date={addItemDate}
        onClose={() => {
          setAddItemDate(null);
          setNewDayDate('');
        }}
      />
      <DeleteTripDialog
        open={deleteOpen}
        tripTitle={trip.title}
        isPending={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}

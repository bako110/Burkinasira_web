import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  MapPin,
  Wallet,
  Calendar,
  Route,
  FileText,
  ChevronDown,
  CalendarDays,
  ListChecks,
  Hourglass,
  Landmark,
  BedDouble,
  Utensils,
  Sparkles,
  PartyPopper,
  Compass,
  Bus,
  Tag,
  type LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';

import {
  Button,
  Spinner,
  EmptyResults,
  DetailBackButton,
  Input,
  ConfirmDialog,
  AnimatedCounter,
  Reveal,
} from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useTripDetail } from '../hooks/useTripDetail';
import { useDeleteTrip } from '../hooks/useDeleteTrip';
import { useRemoveTripDayItem } from '../hooks/useTripDayItems';
import { AddDayItemModal } from '../components/AddDayItemModal';
import { DeleteTripDialog } from '../components/DeleteTripDialog';
import type { TripItemType, TripStatus } from '../types';
import styles from './TripDetailPage.module.css';

const STATUS_TONE: Record<TripStatus, string> = {
  draft: 'toneDraft',
  planned: 'tonePlanned',
  in_progress: 'toneInProgress',
  completed: 'toneCompleted',
  cancelled: 'toneCancelled',
};

const ITEM_META: Record<TripItemType, { Icon: LucideIcon; tone: string }> = {
  destination: { Icon: Landmark, tone: 'itemDestination' },
  hotel: { Icon: BedDouble, tone: 'itemHotel' },
  restaurant: { Icon: Utensils, tone: 'itemRestaurant' },
  experience: { Icon: Sparkles, tone: 'itemExperience' },
  event: { Icon: PartyPopper, tone: 'itemEvent' },
  guide: { Icon: Compass, tone: 'itemGuide' },
  transport: { Icon: Bus, tone: 'itemTransport' },
  autre: { Icon: Tag, tone: 'itemOther' },
};

const MS_PER_DAY = 86_400_000;

/** Numéro de jour (UTC) d'une date ISO : évite les décalages de fuseau dans les écarts en jours. */
function dayNumber(iso: string): number {
  return Math.floor(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / MS_PER_DAY);
}

function todayNumber(): number {
  const n = new Date();
  return Math.floor(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) / MS_PER_DAY);
}

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
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [barReady, setBarReady] = useState(false);
  const [pendingRemoveItem, setPendingRemoveItem] = useState<{ date: string; itemIndex: number } | undefined>(
    undefined,
  );

  const days = useMemo(() => [...(trip?.days ?? [])].sort((a, b) => a.date.localeCompare(b.date)), [trip?.days]);

  // La barre de budget se remplit après le premier rendu, pour que l'animation soit visible.
  useEffect(() => {
    const id = requestAnimationFrame(() => setBarReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Met en évidence, dans la navigation, le jour actuellement visible à l'écran.
  useEffect(() => {
    if (days.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveDate(visible[0].target.getAttribute('data-date'));
      },
      { rootMargin: '-120px 0px -55% 0px', threshold: 0 },
    );
    days.forEach((d) => {
      const el = document.getElementById(`day-${d.date}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [days]);

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

  function handleConfirmRemoveItem() {
    if (!pendingRemoveItem) return;
    removeItem(
      { date: pendingRemoveItem.date, item_index: pendingRemoveItem.itemIndex },
      {
        onSuccess: () => {
          push({ variant: 'success', message: t('trips.itemRemoved') });
          setPendingRemoveItem(undefined);
        },
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  function toggleDay(date: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  }

  function jumpToDay(date: string) {
    setCollapsed((prev) => {
      if (!prev.has(date)) return prev;
      const next = new Set(prev);
      next.delete(date);
      return next;
    });
    setActiveDate(date);
    document.getElementById(`day-${date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const dayCost = (items: { estimated_cost?: number }[]) =>
    items.reduce((sum, item) => sum + (item.estimated_cost ?? 0), 0);
  const totalEstimated = days.reduce((sum, day) => sum + dayCost(day.items), 0);
  const totalActivities = days.reduce((sum, day) => sum + day.items.length, 0);
  const budget = trip.budget_estimate;
  const hasBudget = typeof budget === 'number' && budget > 0;
  const budgetPct = hasBudget ? Math.round((totalEstimated / budget) * 100) : 0;
  const budgetTone = budgetPct > 100 ? 'barOver' : budgetPct >= 80 ? 'barWarn' : 'barOk';

  // Compte à rebours / avancement, calculé à partir des dates du voyage.
  const startIso = trip.start_date ?? days[0]?.date;
  const endIso = trip.end_date ?? days[days.length - 1]?.date ?? startIso;
  const today = todayNumber();
  let countdown: { value: string; label: string };
  if (!startIso || !endIso) {
    countdown = { value: '—', label: t('trips.dash.datesTbd', { defaultValue: 'Dates à définir' }) };
  } else if (today < dayNumber(startIso)) {
    const count = dayNumber(startIso) - today;
    countdown = {
      value: String(count),
      label: t('trips.dash.startsIn', { count, defaultValue: 'jours avant le départ' }),
    };
  } else if (today > dayNumber(endIso)) {
    countdown = { value: '✓', label: t('trips.dash.finished', { defaultValue: 'Voyage terminé' }) };
  } else {
    const total = dayNumber(endIso) - dayNumber(startIso) + 1;
    countdown = {
      value: `${today - dayNumber(startIso) + 1}/${total}`,
      label: t('trips.dash.ongoing', { defaultValue: 'Voyage en cours' }),
    };
  }

  const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso).toLocaleDateString(i18n.language, opts);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroOrb} aria-hidden="true" />
        <DetailBackButton fallbackTo="/trips" className={styles.backBtn} />

        <div className={styles.heroContent}>
          <span className={clsx(styles.status, styles[STATUS_TONE[trip.status]])}>
            <span className={styles.statusDot} aria-hidden="true" />
            {t(`trips.status.${trip.status}`)}
          </span>
          <h1 className={styles.title}>{trip.title}</h1>
          <div className={styles.heroMeta}>
            {trip.region && (
              <span className={styles.metaChip}>
                <MapPin size={14} strokeWidth={2} />
                {trip.region}
              </span>
            )}
            {trip.start_date && (
              <span className={styles.metaChip}>
                <Calendar size={14} strokeWidth={2} />
                {formatDate(trip.start_date, { day: '2-digit', month: 'long' })}
                {trip.end_date && ` – ${formatDate(trip.end_date, { day: '2-digit', month: 'long' })}`}
              </span>
            )}
          </div>

          <div className={styles.heroActions}>
            <button type="button" className={styles.heroBtnPrimary} onClick={() => navigate(`/trips/${trip.id}/plan`)}>
              <Route size={16} strokeWidth={2} />
              {t('planner.planAndBudget')}
            </button>
            <button type="button" className={styles.heroBtnGlass} onClick={() => navigate(`/trips/${trip.id}/recap`)}>
              <FileText size={16} strokeWidth={2} />
              {t('recap.recapCta')}
            </button>
            <button
              type="button"
              className={styles.heroBtnIcon}
              onClick={() => setDeleteOpen(true)}
              aria-label={t('trips.deleteTrip')}
              title={t('trips.deleteTrip')}
            >
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <Reveal className={styles.stats}>
          <div className={styles.statCard}>
            <span className={clsx(styles.statIcon, styles.statIconTeal)}>
              <CalendarDays size={18} strokeWidth={2} />
            </span>
            <span className={styles.statValue}>
              <AnimatedCounter target={days.length} />
            </span>
            <span className={styles.statLabel}>{t('trips.dash.days', { defaultValue: 'Jours planifiés' })}</span>
          </div>
          <div className={styles.statCard}>
            <span className={clsx(styles.statIcon, styles.statIconBlue)}>
              <ListChecks size={18} strokeWidth={2} />
            </span>
            <span className={styles.statValue}>
              <AnimatedCounter target={totalActivities} />
            </span>
            <span className={styles.statLabel}>{t('trips.dash.activities', { defaultValue: 'Activités' })}</span>
          </div>
          <div className={styles.statCard}>
            <span className={clsx(styles.statIcon, styles.statIconOrange)}>
              <Hourglass size={18} strokeWidth={2} />
            </span>
            <span className={styles.statValue}>{countdown.value}</span>
            <span className={styles.statLabel}>{countdown.label}</span>
          </div>
          <div className={clsx(styles.statCard, styles.budgetCard)}>
            <span className={clsx(styles.statIcon, styles.statIconGreen)}>
              <Wallet size={18} strokeWidth={2} />
            </span>
            <span className={styles.statValue}>
              <AnimatedCounter target={totalEstimated} />
              <small className={styles.statUnit}>{trip.currency}</small>
            </span>
            {hasBudget ? (
              <>
                <span className={styles.barTrack} role="progressbar" aria-valuenow={Math.min(budgetPct, 100)} aria-valuemin={0} aria-valuemax={100}>
                  <span
                    className={clsx(styles.barFill, styles[budgetTone])}
                    style={{ width: barReady ? `${Math.min(budgetPct, 100)}%` : '0%' }}
                  />
                </span>
                <span className={styles.statLabel}>
                  {budgetPct > 100
                    ? t('trips.dash.overBudget', {
                        amount: (totalEstimated - budget).toLocaleString('fr-FR'),
                        currency: trip.currency,
                        defaultValue: 'Dépassement de {{amount}} {{currency}}',
                      })
                    : t('trips.dash.budgetUsed', {
                        pct: budgetPct,
                        total: budget.toLocaleString('fr-FR'),
                        currency: trip.currency,
                        defaultValue: '{{pct}} % de {{total}} {{currency}}',
                      })}
                </span>
              </>
            ) : (
              <span className={styles.statLabel}>{t('trips.dash.estimated', { defaultValue: 'Coût estimé' })}</span>
            )}
          </div>
        </Reveal>

        {days.length > 0 && (
          <nav className={styles.dayNav} aria-label={t('trips.dash.dayNav', { defaultValue: 'Navigation par jour' })}>
            {days.map((day, i) => (
              <button
                key={day.date}
                type="button"
                className={clsx(styles.dayPill, activeDate === day.date && styles.dayPillActive)}
                onClick={() => jumpToDay(day.date)}
              >
                <span className={styles.dayPillNum}>{t('trips.dash.dayShort', { n: i + 1, defaultValue: 'J{{n}}' })}</span>
                <span className={styles.dayPillDate}>{formatDate(day.date, { day: '2-digit', month: 'short' })}</span>
              </button>
            ))}
          </nav>
        )}

        {days.length === 0 && (
          <EmptyResults variant="empty" title={t('trips.noDays')} text={t('trips.noDaysText')} />
        )}

        <div className={styles.timeline}>
          {days.map((day, dayIdx) => {
            const isOpen = !collapsed.has(day.date);
            const isToday = dayNumber(day.date) === today;
            const cost = dayCost(day.items);
            return (
              <Reveal key={day.date} delay={Math.min(dayIdx, 5) * 50}>
                <div id={`day-${day.date}`} data-date={day.date} className={styles.dayRow}>
                  <div className={styles.dayRail}>
                    <span className={clsx(styles.dayNum, isToday && styles.dayNumToday)}>{dayIdx + 1}</span>
                  </div>

                  <div className={clsx(styles.dayCard, isToday && styles.dayCardToday)}>
                    <div className={styles.dayHeader}>
                      <button
                        type="button"
                        className={styles.dayToggle}
                        onClick={() => toggleDay(day.date)}
                        aria-expanded={isOpen}
                      >
                        <span className={styles.dayHeading}>
                          <span className={styles.dayTitle}>
                            {formatDate(day.date, { weekday: 'long', day: '2-digit', month: 'long' })}
                          </span>
                          <span className={styles.daySub}>
                            {isToday && (
                              <span className={styles.todayBadge}>{t('trips.dash.today', { defaultValue: "Aujourd'hui" })}</span>
                            )}
                            <span>
                              {t('trips.dash.activityCount', { count: day.items.length, defaultValue: '{{count}} activité(s)' })}
                            </span>
                            {cost > 0 && (
                              <span className={styles.dayCost}>
                                {cost.toLocaleString('fr-FR')} {trip.currency}
                              </span>
                            )}
                          </span>
                        </span>
                        <ChevronDown size={18} strokeWidth={2} className={clsx(styles.chevron, isOpen && styles.chevronOpen)} />
                      </button>
                      <Button variant="ghost" size="sm" onClick={() => setAddItemDate(day.date)}>
                        <Plus size={15} strokeWidth={2} />
                        {t('trips.addItemCta')}
                      </Button>
                    </div>

                    <div className={clsx(styles.collapse, isOpen && styles.collapseOpen)}>
                      <div className={styles.collapseInner}>
                        {day.items.length === 0 ? (
                          <button type="button" className={styles.dayEmpty} onClick={() => setAddItemDate(day.date)}>
                            <Plus size={16} strokeWidth={2} />
                            {t('trips.dayEmpty')}
                          </button>
                        ) : (
                          <ol className={styles.itemsList}>
                            {day.items.map((item, idx) => {
                              const meta = ITEM_META[item.type] ?? ITEM_META.autre;
                              return (
                                <li key={idx} className={styles.itemRow}>
                                  <span className={styles.itemTime}>{item.time ?? '•'}</span>
                                  <span className={clsx(styles.itemIcon, styles[meta.tone])}>
                                    <meta.Icon size={18} strokeWidth={2} />
                                  </span>
                                  <div className={styles.itemBody}>
                                    <p className={styles.itemTitle}>{item.title}</p>
                                    <span className={styles.itemType}>{t(`trips.itemTypes.${item.type}`)}</span>
                                    {item.notes && <p className={styles.itemNotes}>{item.notes}</p>}
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
                                      onClick={() => setPendingRemoveItem({ date: day.date, itemIndex: idx })}
                                      aria-label={t('trips.removeItem')}
                                    >
                                      <Trash2 size={14} strokeWidth={2} />
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className={styles.addDayCard}>
          <div className={styles.addDayText}>
            <span className={styles.addDayTitle}>{t('trips.dash.addDayTitle', { defaultValue: 'Prolonger le voyage' })}</span>
            <span className={styles.addDayHint}>{t('trips.dash.addDayHint', { defaultValue: 'Choisissez une date pour ajouter une nouvelle journée.' })}</span>
          </div>
          <div className={styles.addDayRow}>
            <Input
              type="date"
              className={styles.addDayInput}
              value={newDayDate}
              onChange={(e) => setNewDayDate(e.target.value)}
              aria-label={t('trips.addDayLabel')}
            />
            <Button size="sm" onClick={() => newDayDate && setAddItemDate(newDayDate)} disabled={!newDayDate}>
              <Plus size={15} strokeWidth={2} />
              {t('trips.addDayCta')}
            </Button>
          </div>
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

      <ConfirmDialog
        open={Boolean(pendingRemoveItem)}
        title={t('trips.removeItemConfirmTitle')}
        message={t('trips.removeItemConfirmMessage')}
        confirmLabel={t('trips.removeItem')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onCancel={() => setPendingRemoveItem(undefined)}
        onConfirm={handleConfirmRemoveItem}
      />
    </div>
  );
}

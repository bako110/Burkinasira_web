import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Check, Wallet, MapPin, FileText, Users } from 'lucide-react';
import clsx from 'clsx';

import {
  Button,
  Spinner,
  EmptyResults,
  DetailBackButton,
  Tabs,
  RegionProvinceFilter,
} from '../../../shared/ui';
import type { TabItem } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';

import { useTripDetail } from '../../trips/hooks/useTripDetail';
import type { TripDayItem, TripItemType } from '../../trips/types';

import { useHotels } from '../../hotels/hooks/useHotels';
import { useRestaurants } from '../../restaurants/hooks/useRestaurants';
import { useGuides } from '../../guides/hooks/useGuides';
import { useTransportProviders } from '../../mobility/hooks/useTransportProviders';

import { useAddResourceToTrip } from '../usePlanner';
import {
  buildBudget,
  formatXof,
  BUDGET_CATEGORIES,
  COMFORT_SCALES,
  type ComfortLevel,
} from '../budget';
import { TravelAdvice } from '../components/TravelAdvice';
import styles from './PlannerPage.module.css';

type ResourceTab = 'hotels' | 'restaurants' | 'guides' | 'transport';

const COMFORT_LEVELS: ComfortLevel[] = ['eco', 'standard', 'confort'];

export function PlannerPage() {
  const { t } = useTranslation();
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);

  const { data: trip, isLoading, isError, refetch } = useTripDetail(tripId);
  const { mutate: addResource, isPending: isAdding } = useAddResourceToTrip(tripId ?? '');

  const [tab, setTab] = useState<ResourceTab>('hotels');
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [comfort, setComfort] = useState<ComfortLevel>('standard');
  const [travelers, setTravelers] = useState(2);
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set());

  // La zone par défaut = région du voyage.
  const effectiveRegion = region ?? trip?.region ?? undefined;

  const budget = useMemo(() => {
    if (!trip) return null;
    return buildBudget({
      days: trip.days,
      startDate: trip.start_date,
      endDate: trip.end_date,
      comfort,
      travelers,
    });
  }, [trip, comfort, travelers]);

  function handleAdd(item: TripDayItem, key: string) {
    if (!tripId) return;
    addResource(
      { item },
      {
        onSuccess: () => {
          setJustAdded((prev) => new Set(prev).add(key));
          push({ variant: 'success', message: t('planner.added') });
        },
        onError: (err) =>
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
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
        <EmptyResults variant="error" title={t('trips.detailNotFound')} onRetry={() => refetch()} />
        <Button variant="ghost" onClick={() => navigate('/trips')}>
          {t('trips.myTripsTitle')}
        </Button>
      </div>
    );
  }

  const tabs: TabItem[] = [
    { key: 'hotels', label: t('planner.tabs.hotels') },
    { key: 'restaurants', label: t('planner.tabs.restaurants') },
    { key: 'guides', label: t('planner.tabs.guides') },
    { key: 'transport', label: t('planner.tabs.transport') },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <DetailBackButton fallbackTo={`/trips/${tripId}`} className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.kicker}>{t('planner.kicker')}</span>
          <h1 className={styles.title}>{trip.title}</h1>
          <p className={styles.subtitle}>{t('planner.subtitle')}</p>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.mainCol}>
          {/* --- Paramètres du voyage --- */}
          <div className={styles.paramsCard}>
            <div className={styles.paramRow}>
              <label className={styles.paramLabel}>
                <Users size={15} strokeWidth={2} />
                {t('planner.travelers')}
              </label>
              <div className={styles.stepper}>
                <button type="button" onClick={() => setTravelers((n) => Math.max(1, n - 1))}>
                  −
                </button>
                <span>{travelers}</span>
                <button type="button" onClick={() => setTravelers((n) => Math.min(20, n + 1))}>
                  +
                </button>
              </div>
            </div>

            <div className={styles.paramRow}>
              <span className={styles.paramLabel}>{t('planner.comfort')}</span>
              <div className={styles.comfortGroup}>
                {COMFORT_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={clsx(styles.comfortChip, comfort === lvl && styles.comfortChipActive)}
                    onClick={() => setComfort(lvl)}
                  >
                    {t(`planner.comfortLevels.${lvl}`)}
                  </button>
                ))}
              </div>
            </div>

            <p className={styles.comfortHint}>
              {t('planner.comfortHint', {
                nuitee: formatXof(COMFORT_SCALES[comfort].nuitee),
                repas: formatXof(COMFORT_SCALES[comfort].repas),
              })}
            </p>
          </div>

          {/* --- Budget (mobile : ici ; desktop : colonne latérale) --- */}
          {budget && <BudgetCard budget={budget} onRecap={() => navigate(`/trips/${tripId}/recap`)} className={styles.budgetMobile} />}

          {/* --- Explorer la zone --- */}
          <div className={styles.exploreHeader}>
            <h2 className={styles.exploreTitle}>
              <MapPin size={16} strokeWidth={2} />
              {t('planner.exploreZone')}
            </h2>
            <RegionProvinceFilter
              region={effectiveRegion}
              province={province}
              showProvince
              onChange={(r, p) => {
                setRegion(r);
                setProvince(p);
              }}
            />
          </div>

          <Tabs items={tabs} active={tab} onChange={(k) => setTab(k as ResourceTab)} />

          <div className={styles.resourceList}>
            {tab === 'hotels' && (
              <HotelList
                region={effectiveRegion}
                province={province}
                disabled={isAdding}
                added={justAdded}
                onAdd={handleAdd}
              />
            )}
            {tab === 'restaurants' && (
              <RestaurantList
                region={effectiveRegion}
                province={province}
                disabled={isAdding}
                added={justAdded}
                onAdd={handleAdd}
              />
            )}
            {tab === 'guides' && (
              <GuideList
                region={effectiveRegion}
                province={province}
                disabled={isAdding}
                added={justAdded}
                onAdd={handleAdd}
              />
            )}
            {tab === 'transport' && (
              <TransportList
                region={effectiveRegion}
                province={province}
                disabled={isAdding}
                added={justAdded}
                onAdd={handleAdd}
              />
            )}
          </div>

          {/* --- Conseils (mobile : ici) --- */}
          <div className={styles.adviceMobile}>
            <TravelAdvice />
          </div>
        </div>

        {/* --- Colonne latérale (desktop) --- */}
        <aside className={styles.sideCol}>
          {budget && (
            <BudgetCard budget={budget} onRecap={() => navigate(`/trips/${tripId}/recap`)} />
          )}
          <TravelAdvice collapsedByDefault />
        </aside>
      </div>
    </div>
  );
}

interface BudgetCardProps {
  budget: ReturnType<typeof buildBudget>;
  onRecap: () => void;
  className?: string;
}

function BudgetCard({ budget, onRecap, className }: BudgetCardProps) {
  const { t } = useTranslation();
  return (
    <div className={clsx(styles.budgetCard, className)}>
      <div className={styles.budgetHeader}>
        <h2 className={styles.budgetTitle}>
          <Wallet size={17} strokeWidth={2} />
          {t('planner.budgetTitle')}
        </h2>
        <span className={styles.budgetTotal}>{formatXof(budget.total)}</span>
      </div>

      <p className={styles.budgetMeta}>
        {t('planner.budgetMeta', {
          days: budget.days,
          nights: budget.nights,
          travelers: budget.travelers,
        })}
      </p>

      <div className={styles.budgetBars}>
        {BUDGET_CATEGORIES.map((cat) => {
          const value = budget.byCategory[cat];
          if (value <= 0) return null;
          const pct = budget.total > 0 ? Math.round((value / budget.total) * 100) : 0;
          return (
            <div key={cat} className={styles.budgetBarRow}>
              <span className={styles.budgetBarLabel}>{t(`planner.categories.${cat}`)}</span>
              <span className={styles.budgetBarTrack}>
                <span className={styles.budgetBarFill} style={{ width: `${pct}%` }} />
              </span>
              <span className={styles.budgetBarValue}>{formatXof(value)}</span>
            </div>
          );
        })}
      </div>

      <p className={styles.perPerson}>
        {t('planner.perPerson', {
          amount: formatXof(budget.total / Math.max(budget.travelers, 1)),
        })}
      </p>

      <Button variant="secondary" fullWidth onClick={onRecap}>
        <FileText size={15} strokeWidth={2} />
        {t('planner.viewRecap')}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sous-listes par type de ressource                                  */
/* ------------------------------------------------------------------ */

interface ListProps {
  region?: string;
  province?: string;
  disabled: boolean;
  added: Set<string>;
  onAdd: (item: TripDayItem, key: string) => void;
}

function AddButton({
  added,
  disabled,
  onClick,
}: {
  added: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={clsx(styles.addBtn, added && styles.addBtnDone)}
      onClick={onClick}
      disabled={disabled || added}
    >
      {added ? <Check size={15} strokeWidth={2.5} /> : <Plus size={15} strokeWidth={2.5} />}
      {added ? t('planner.inTrip') : t('planner.add')}
    </button>
  );
}

function ListShell({
  isLoading,
  isError,
  empty,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className={styles.listCenter}>
        <Spinner size={24} />
      </div>
    );
  }
  if (isError) {
    return <EmptyResults variant="error" />;
  }
  if (empty) {
    return <EmptyResults variant="empty" title={t('planner.noResults')} text={t('planner.noResultsText')} />;
  }
  return <>{children}</>;
}

function HotelList({ region, province, disabled, added, onAdd }: ListProps) {
  const { i18n } = useTranslation();
  const { data, isLoading, isError } = useHotels({ region, province, page_size: 20 });
  const items = data?.items ?? [];

  return (
    <ListShell isLoading={isLoading} isError={isError} empty={items.length === 0}>
      {items.map((h) => {
        const key = `hotel:${h.id}`;
        const cost = h.min_price ?? COMFORT_SCALES.standard.nuitee;
        return (
          <ResourceRow
            key={key}
            photo={h.photo}
            title={h.name}
            subtitle={[h.city, h.region].filter(Boolean).join(' · ')}
            meta={
              h.min_price
                ? `${h.min_price.toLocaleString(i18n.language)} ${h.currency} / nuit`
                : undefined
            }
            rating={h.average_rating}
            verified={h.is_verified}
            actionSlot={
              <AddButton
                added={added.has(key)}
                disabled={disabled}
                onClick={() =>
                  onAdd(
                    {
                      type: 'hotel' as TripItemType,
                      title: h.name,
                      reference_id: h.id,
                      estimated_cost: cost,
                      notes: [h.city, h.region].filter(Boolean).join(', '),
                    },
                    key,
                  )
                }
              />
            }
          />
        );
      })}
    </ListShell>
  );
}

function RestaurantList({ region, province, disabled, added, onAdd }: ListProps) {
  const { data, isLoading, isError } = useRestaurants({ region, province, page_size: 20 });
  const items = data?.items ?? [];

  return (
    <ListShell isLoading={isLoading} isError={isError} empty={items.length === 0}>
      {items.map((r) => {
        const key = `restaurant:${r.id}`;
        return (
          <ResourceRow
            key={key}
            photo={r.photo}
            title={r.name}
            subtitle={[r.cuisine_style, r.city, r.region].filter(Boolean).join(' · ')}
            rating={r.average_rating}
            actionSlot={
              <AddButton
                added={added.has(key)}
                disabled={disabled}
                onClick={() =>
                  onAdd(
                    {
                      type: 'restaurant' as TripItemType,
                      title: r.name,
                      reference_id: r.id,
                      estimated_cost: COMFORT_SCALES.standard.repas,
                      notes: [r.cuisine_style, r.city].filter(Boolean).join(', '),
                    },
                    key,
                  )
                }
              />
            }
          />
        );
      })}
    </ListShell>
  );
}

function GuideList({ region, province, disabled, added, onAdd }: ListProps) {
  const { i18n } = useTranslation();
  const { data, isLoading, isError } = useGuides({ region, province, page_size: 20 });
  const items = data?.items ?? [];

  return (
    <ListShell isLoading={isLoading} isError={isError} empty={items.length === 0}>
      {items.map((g) => {
        const key = `guide:${g.id}`;
        const cost = g.daily_rate ?? COMFORT_SCALES.standard.guideJour;
        return (
          <ResourceRow
            key={key}
            photo={g.photo_url}
            title={g.display_name}
            subtitle={g.specialties.slice(0, 2).join(' · ')}
            meta={
              g.daily_rate
                ? `${g.daily_rate.toLocaleString(i18n.language)} ${g.currency} / jour`
                : undefined
            }
            rating={g.average_rating}
            verified={g.is_verified}
            actionSlot={
              <AddButton
                added={added.has(key)}
                disabled={disabled}
                onClick={() =>
                  onAdd(
                    {
                      type: 'guide' as TripItemType,
                      title: g.display_name,
                      reference_id: g.id,
                      estimated_cost: cost,
                      notes: g.languages.join(', '),
                    },
                    key,
                  )
                }
              />
            }
          />
        );
      })}
    </ListShell>
  );
}

function TransportList({ region, province, disabled, added, onAdd }: ListProps) {
  const { i18n } = useTranslation();
  // Le backend mobilité ne filtre pas par province : on ne passe que la région.
  const { data, isLoading, isError } = useTransportProviders({ region, province, page_size: 20 });
  const items = data?.items ?? [];

  return (
    <ListShell isLoading={isLoading} isError={isError} empty={items.length === 0}>
      {items.map((p) => {
        const key = `transport:${p.id}`;
        const cost = p.price_estimate ?? COMFORT_SCALES.standard.transportJour;
        return (
          <ResourceRow
            key={key}
            photo={p.photo}
            title={p.name}
            subtitle={[p.city, p.region].filter(Boolean).join(' · ')}
            meta={
              p.price_estimate
                ? `~ ${p.price_estimate.toLocaleString(i18n.language)} ${p.price_currency}`
                : undefined
            }
            rating={p.average_rating}
            verified={p.is_verified}
            actionSlot={
              <AddButton
                added={added.has(key)}
                disabled={disabled}
                onClick={() =>
                  onAdd(
                    {
                      type: 'transport' as TripItemType,
                      title: p.name,
                      reference_id: p.id,
                      estimated_cost: cost,
                      notes: [p.city, p.region].filter(Boolean).join(', '),
                    },
                    key,
                  )
                }
              />
            }
          />
        );
      })}
    </ListShell>
  );
}

/* ------------------------------------------------------------------ */

interface ResourceRowProps {
  photo?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  rating?: number;
  verified?: boolean;
  actionSlot: React.ReactNode;
}

function ResourceRow({ photo, title, subtitle, meta, rating, verified, actionSlot }: ResourceRowProps) {
  return (
    <div className={styles.resourceRow}>
      <div className={styles.resourceThumb} aria-hidden="true">
        {photo ? <img src={photo} alt="" loading="lazy" /> : <MapPin size={18} strokeWidth={2} />}
      </div>
      <div className={styles.resourceMain}>
        <p className={styles.resourceTitle}>
          {title}
          {verified && <span className={styles.verifiedDot} title="Vérifié" />}
        </p>
        {subtitle && <p className={styles.resourceSub}>{subtitle}</p>}
        <div className={styles.resourceMetaRow}>
          {typeof rating === 'number' && rating > 0 && (
            <span className={styles.resourceRating}>★ {rating.toFixed(1)}</span>
          )}
          {meta && <span className={styles.resourceMeta}>{meta}</span>}
        </div>
      </div>
      <div className={styles.resourceAction}>{actionSlot}</div>
    </div>
  );
}

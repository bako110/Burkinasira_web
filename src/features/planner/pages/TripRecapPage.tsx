import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Wallet, CalendarDays, MapPin, Users } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';

import { useTripDetail } from '../../trips/hooks/useTripDetail';
import {
  buildBudget,
  formatXof,
  BUDGET_CATEGORIES,
  COMFORT_SCALES,
  type ComfortLevel,
} from '../budget';
import { TravelAdvice } from '../components/TravelAdvice';
import styles from './TripRecapPage.module.css';

const COMFORT_LEVELS: ComfortLevel[] = ['eco', 'standard', 'confort'];

export function TripRecapPage() {
  const { t, i18n } = useTranslation();
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);

  const { data: trip, isLoading, isError, refetch } = useTripDetail(tripId);
  const [comfort, setComfort] = useState<ComfortLevel>('standard');
  const [travelers, setTravelers] = useState(2);

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

  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    if (!trip) return;
    setExporting(true);
    try {
      const { generateRecapPdf } = await import('../recapPdf');
      generateRecapPdf({
        trip,
        comfort,
        travelers,
        labels: {
          categories: Object.fromEntries(
            BUDGET_CATEGORIES.map((c) => [c, t(`planner.categories.${c}`)]),
          ),
          itemTypes: Object.fromEntries(
            ['destination', 'hotel', 'restaurant', 'experience', 'event', 'guide', 'transport', 'autre'].map(
              (it) => [it, t(`trips.itemTypes.${it}`)],
            ),
          ),
          comfortLevel: t(`planner.comfortLevels.${comfort}`),
          title: t('recap.pdfTitle'),
          generatedOn: t('recap.generatedOn', { date: new Date().toLocaleDateString(i18n.language) }),
          tripDates: t('recap.tripDates'),
          zone: t('recap.zone'),
          travelersLabel: t('planner.travelers'),
          comfortLabel: t('planner.comfort'),
          budgetTitle: t('planner.budgetTitle'),
          perDay: t('recap.perDay'),
          perPerson: t('recap.perPersonShort'),
          total: t('recap.total'),
          itineraryTitle: t('recap.itineraryTitle'),
          noPlan: t('recap.noPlan'),
          disclaimer: t('recap.disclaimer'),
        },
      });
      push({ variant: 'success', message: t('recap.exported') });
    } catch (err) {
      push({ variant: 'error', message: t('common.error') });
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !trip || !budget) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults variant="error" title={t('trips.detailNotFound')} onRetry={() => refetch()} />
        <Button variant="ghost" onClick={() => navigate('/trips')}>
          {t('trips.myTripsTitle')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <DetailBackButton fallbackTo={`/trips/${tripId}/plan`} className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.kicker}>{t('recap.kicker')}</span>
          <h1 className={styles.title}>{trip.title}</h1>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.metaGrid}>
          {(trip.start_date || trip.end_date) && (
            <span className={styles.metaItem}>
              <CalendarDays size={15} strokeWidth={2} />
              {trip.start_date
                ? new Date(trip.start_date).toLocaleDateString(i18n.language, {
                    day: '2-digit',
                    month: 'short',
                  })
                : '?'}
              {' – '}
              {trip.end_date
                ? new Date(trip.end_date).toLocaleDateString(i18n.language, {
                    day: '2-digit',
                    month: 'short',
                  })
                : '?'}
            </span>
          )}
          {trip.region && (
            <span className={styles.metaItem}>
              <MapPin size={15} strokeWidth={2} />
              {trip.region}
            </span>
          )}
          <span className={styles.metaItem}>
            <Users size={15} strokeWidth={2} />
            {t('recap.travelersCount', { count: travelers })}
          </span>
        </div>

        {/* Réglages */}
        <div className={styles.settingsRow}>
          <div className={styles.setting}>
            <span className={styles.settingLabel}>{t('planner.travelers')}</span>
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
          <div className={styles.setting}>
            <span className={styles.settingLabel}>{t('planner.comfort')}</span>
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
          </div>
        </div>

        {/* Budget détaillé */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Wallet size={17} strokeWidth={2} />
            {t('planner.budgetTitle')}
          </h2>
          <table className={styles.table}>
            <tbody>
              {BUDGET_CATEGORIES.map((cat) => {
                const value = budget.byCategory[cat];
                if (value <= 0) return null;
                return (
                  <tr key={cat}>
                    <td>{t(`planner.categories.${cat}`)}</td>
                    <td className={styles.amount}>{formatXof(value)}</td>
                  </tr>
                );
              })}
              <tr className={styles.totalRow}>
                <td>{t('recap.total')}</td>
                <td className={styles.amount}>{formatXof(budget.total)}</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.split}>
            {t('recap.perPersonShort')} : <strong>{formatXof(budget.total / Math.max(travelers, 1))}</strong>
            {' · '}
            {t('recap.perDay')} : <strong>{formatXof(budget.total / Math.max(budget.days, 1))}</strong>
          </p>
          <p className={styles.baseHint}>
            {t('planner.comfortHint', {
              nuitee: formatXof(COMFORT_SCALES[comfort].nuitee),
              repas: formatXof(COMFORT_SCALES[comfort].repas),
            })}
          </p>
        </div>

        {/* Itinéraire */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <CalendarDays size={17} strokeWidth={2} />
            {t('recap.itineraryTitle')}
          </h2>
          {trip.days.length === 0 ? (
            <p className={styles.empty}>{t('recap.noPlan')}</p>
          ) : (
            <div className={styles.days}>
              {trip.days.map((day) => (
                <div key={day.date} className={styles.day}>
                  <p className={styles.dayDate}>
                    {new Date(day.date).toLocaleDateString(i18n.language, {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                    })}
                  </p>
                  {day.items.length === 0 ? (
                    <p className={styles.dayEmpty}>—</p>
                  ) : (
                    <ul className={styles.itemList}>
                      {day.items.map((item, i) => (
                        <li key={i}>
                          {item.time && <span className={styles.itemTime}>{item.time}</span>}
                          <span className={styles.itemType}>{t(`trips.itemTypes.${item.type}`)}</span>
                          <span className={styles.itemTitle}>{item.title}</span>
                          {typeof item.estimated_cost === 'number' && item.estimated_cost > 0 && (
                            <span className={styles.itemCost}>{formatXof(item.estimated_cost)}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Button fullWidth onClick={handleExport} disabled={exporting}>
          {exporting ? (
            <Spinner size={16} />
          ) : (
            <>
              <Download size={16} strokeWidth={2} />
              {t('recap.exportPdf')}
            </>
          )}
        </Button>

        <div className={styles.adviceBlock}>
          <TravelAdvice />
        </div>

        <p className={styles.disclaimer}>{t('recap.disclaimer')}</p>
      </div>
    </div>
  );
}

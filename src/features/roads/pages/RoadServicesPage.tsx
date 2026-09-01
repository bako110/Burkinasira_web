import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { LocateFixed, ShieldAlert } from 'lucide-react';

import { Button, Reveal, EmptyResults, CardSkeleton, ListingHero } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useRoadServices } from '../hooks/useRoadServices';
import { useGeolocation } from '../hooks/useGeolocation';
import { RoadServiceCard } from '../components/RoadServiceCard';
import { RoadServiceFilters } from '../components/RoadServiceFilters';
import { ReportBreakdownModal } from '../components/ReportBreakdownModal';
import type { RoadServiceSummary, RoadServiceType } from '../types';
import styles from './RoadServicesPage.module.css';

const PAGE_SIZE = 12;
const DEFAULT_RADIUS_KM = 25;

export function RoadServicesPage() {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = (searchParams.get('type') as RoadServiceType | null) ?? undefined;

  const [queryInput, setQueryInput] = useState('');
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<RoadServiceSummary[]>([]);
  const [nearMeActive, setNearMeActive] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const { coords, isLocating, locate } = useGeolocation();

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlType, nearMeActive, coords]);

  const { data, isLoading, isFetching, isError, refetch } = useRoadServices({
    type: urlType,
    page,
    page_size: PAGE_SIZE,
    ...(nearMeActive && coords
      ? { near_lat: coords.latitude, near_lng: coords.longitude, radius_km: DEFAULT_RADIUS_KM }
      : {}),
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  function applyType(value: RoadServiceType | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
      return next;
    });
  }

  function toggleNearMe() {
    if (!nearMeActive) {
      locate();
      setNearMeActive(true);
    } else {
      setNearMeActive(false);
    }
  }

  const filtered = queryInput.trim()
    ? accumulated.filter((s) => s.name.toLowerCase().includes(queryInput.trim().toLowerCase()))
    : accumulated;

  const total = data?.total ?? 0;
  const hasMore = accumulated.length > 0 && accumulated.length < total;
  const showInitialLoading = isLoading && page === 1;

  return (
    <div className={styles.page}>
      <ListingHero
        title={t('roads.title')}
        subtitle={t('roads.subtitle')}
        searchPlaceholder={t('roads.searchPlaceholder')}
        searchLabel={t('common.search')}
        searchButtonLabel={t('common.search')}
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmit={() => {}}
      />

      <div className={styles.body}>
        <div className={styles.actionsRow}>
          <Button
            variant={nearMeActive ? 'primary' : 'secondary'}
            onClick={toggleNearMe}
            disabled={isLocating}
          >
            <LocateFixed size={16} strokeWidth={2} />
            {isLocating ? t('roads.locating') : t('roads.nearMe')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => requireAuth(() => setReportOpen(true), t('roads.reportBreakdownRequiresAuth'))}
          >
            <ShieldAlert size={16} strokeWidth={2} />
            {t('roads.reportBreakdown')}
          </Button>
        </div>

        <RoadServiceFilters active={urlType} onChange={applyType} />

        {!showInitialLoading && !isError && (
          <p className={styles.resultsCount}>{t('explore.resultsCount', { count: total })}</p>
        )}

        {showInitialLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!showInitialLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

        {!showInitialLoading && !isError && filtered.length === 0 && (
          <EmptyResults
            variant="empty"
            title={t('roads.empty')}
            text={t('explore.emptyText')}
            onReset={() => {
              setQueryInput('');
              setNearMeActive(false);
              setSearchParams({});
            }}
          />
        )}

        {!showInitialLoading && !isError && filtered.length > 0 && (
          <>
            <div className={styles.grid}>
              {filtered.map((service, i) => (
                <Reveal key={service.id} delay={Math.min(i, 8) * 50}>
                  <RoadServiceCard service={service} />
                </Reveal>
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreRow}>
                <Button variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={isFetching}>
                  {isFetching ? t('common.loading') : t('explore.loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <ReportBreakdownModal open={reportOpen} onClose={() => setReportOpen(false)} />
    </div>
  );
}

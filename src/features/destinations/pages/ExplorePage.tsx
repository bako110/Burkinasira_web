import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, Reveal, EmptyResults, CardSkeleton, RelatedModules, NearMeToggle } from '../../../shared/ui';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useNearMe } from '../../../shared/hooks/useNearMe';
import { useDestinations } from '../hooks/useDestinations';
import { DestinationCard } from '../components/DestinationCard';
import { CategoryFilters } from '../components/CategoryFilters';
import { ExploreHero } from '../components/ExploreHero';
import type { Destination } from '../types';
import styles from './ExplorePage.module.css';

const PAGE_SIZE = 12;

export function ExplorePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlCategory = searchParams.get('category') ?? undefined;

  const nearMe = useNearMe({ filtersKey: `${urlQuery}|${urlCategory ?? ''}` });
  const [queryInput, setQueryInput] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(queryInput);
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<Destination[]>([]);

  useEffect(() => {
    setQueryInput(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (debouncedQuery === urlQuery) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedQuery) next.set('q', debouncedQuery);
      else next.delete('q');
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlQuery, urlCategory, nearMe.radiusKm]);

  const { data, isLoading, isFetching, isError, refetch } = useDestinations({
    q: urlQuery || undefined,
    category: urlCategory,
    near_lat: nearMe.coords?.latitude,
    near_lng: nearMe.coords?.longitude,
    radius_km: nearMe.radiusKm ?? undefined,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  useEffect(() => {
    nearMe.reportResult({
      resultCount: data?.total,
      isFetching,
      forRadiusKm: nearMe.radiusKm,
    });
  }, [nearMe, data?.total, isFetching]);

  function applySearch() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (queryInput) next.set('q', queryInput);
      else next.delete('q');
      return next;
    });
  }

  function applyCategory(value: string | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('category', value);
      else next.delete('category');
      return next;
    });
  }

  function resetFilters() {
    setQueryInput('');
    setSearchParams({});
  }

  const total = data?.total ?? 0;
  const hasMore = accumulated.length > 0 && accumulated.length < total;
  const showInitialLoading = isLoading && page === 1;

  return (
    <div className={styles.page}>
      <ExploreHero query={queryInput} onQueryChange={setQueryInput} onSubmit={applySearch} />

      <div className={styles.body}>
        <CategoryFilters active={urlCategory} onChange={applyCategory} />
        <NearMeToggle nearMe={nearMe} resultCount={total} />

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

        {!showInitialLoading && isError && (
          <EmptyResults variant="error" onRetry={() => refetch()} />
        )}

        {!showInitialLoading && !isError && accumulated.length === 0 && (
          <EmptyResults variant="empty" onReset={resetFilters} />
        )}

        {!showInitialLoading && !isError && accumulated.length > 0 && (
          <>
            <div className={styles.grid}>
              {accumulated.map((destination, i) => (
                <Reveal key={destination.id} delay={Math.min(i, 8) * 50}>
                  <DestinationCard destination={destination} />
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

        <RelatedModules currentPath="/explore" />
      </div>
    </div>
  );
}

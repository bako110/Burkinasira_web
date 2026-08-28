import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, Reveal, EmptyResults, CardSkeleton, ListingHero, RelatedModules } from '../../../shared/ui';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useRestaurants } from '../hooks/useRestaurants';
import { RestaurantCard } from '../components/RestaurantCard';
import { RestaurantFilters } from '../components/RestaurantFilters';
import type { EstablishmentType, RestaurantSummary } from '../types';
import styles from './RestaurantsPage.module.css';

const PAGE_SIZE = 12;

export function RestaurantsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlType = (searchParams.get('type') as EstablishmentType | null) ?? undefined;

  const [queryInput, setQueryInput] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(queryInput);
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<RestaurantSummary[]>([]);

  useEffect(() => setQueryInput(urlQuery), [urlQuery]);

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
  }, [urlQuery, urlType]);

  const { data, isLoading, isFetching, isError, refetch } = useRestaurants({
    q: urlQuery || undefined,
    type: urlType,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  function applySearch() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (queryInput) next.set('q', queryInput);
      else next.delete('q');
      return next;
    });
  }

  function applyType(value: EstablishmentType | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
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
      <ListingHero
        title={t('restaurants.title')}
        subtitle={t('restaurants.subtitle')}
        searchPlaceholder={t('restaurants.searchPlaceholder')}
        searchLabel={t('common.search')}
        searchButtonLabel={t('common.search')}
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmit={applySearch}
      />

      <div className={styles.body}>
        <RestaurantFilters active={urlType} onChange={applyType} />

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

        {!showInitialLoading && !isError && accumulated.length === 0 && (
          <EmptyResults
            variant="empty"
            title={t('restaurants.empty')}
            text={t('explore.emptyText')}
            onReset={resetFilters}
          />
        )}

        {!showInitialLoading && !isError && accumulated.length > 0 && (
          <>
            <div className={styles.grid}>
              {accumulated.map((restaurant, i) => (
                <Reveal key={restaurant.id} delay={Math.min(i, 8) * 50}>
                  <RestaurantCard restaurant={restaurant} />
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

        <RelatedModules currentPath="/restaurants" />
      </div>
    </div>
  );
}

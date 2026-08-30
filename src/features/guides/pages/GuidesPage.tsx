import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, Reveal, EmptyResults, CardSkeleton, ListingHero, RelatedModules, RegionProvinceFilter } from '../../../shared/ui';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useGuides } from '../hooks/useGuides';
import { GuideCard } from '../components/GuideCard';
import type { GuideSummary } from '../types';
import styles from './GuidesPage.module.css';

const PAGE_SIZE = 12;

export function GuidesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSpecialty = searchParams.get('specialty') ?? '';
  const urlRegion = searchParams.get('region') ?? undefined;
  const urlProvince = searchParams.get('province') ?? undefined;

  const [queryInput, setQueryInput] = useState(urlSpecialty);
  const debouncedQuery = useDebouncedValue(queryInput);
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<GuideSummary[]>([]);

  useEffect(() => setQueryInput(urlSpecialty), [urlSpecialty]);

  useEffect(() => {
    if (debouncedQuery === urlSpecialty) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedQuery) next.set('specialty', debouncedQuery);
      else next.delete('specialty');
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlSpecialty, urlRegion, urlProvince]);

  const { data, isLoading, isFetching, isError, refetch } = useGuides({
    specialty: urlSpecialty || undefined,
    region: urlRegion,
    province: urlProvince,
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
      if (queryInput) next.set('specialty', queryInput);
      else next.delete('specialty');
      return next;
    });
  }

  function applyRegion(value: string | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('region', value);
      else next.delete('region');
      next.delete('province');
      return next;
    });
  }

  function applyProvince(value: string | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('province', value);
      else next.delete('province');
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
        title={t('guides.title')}
        subtitle={t('guides.subtitle')}
        searchPlaceholder={t('guides.searchPlaceholder')}
        searchLabel={t('common.search')}
        searchButtonLabel={t('common.search')}
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmit={applySearch}
      />

      <div className={styles.body}>
        <RegionProvinceFilter
          region={urlRegion}
          province={urlProvince}
          onRegionChange={applyRegion}
          onProvinceChange={applyProvince}
          showProvince
        />

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
            title={t('guides.empty')}
            text={t('explore.emptyText')}
            onReset={resetFilters}
          />
        )}

        {!showInitialLoading && !isError && accumulated.length > 0 && (
          <>
            <div className={styles.grid}>
              {accumulated.map((guide, i) => (
                <Reveal key={guide.id} delay={Math.min(i, 8) * 50}>
                  <GuideCard guide={guide} />
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

        <RelatedModules currentPath="/guides" />
      </div>
    </div>
  );
}

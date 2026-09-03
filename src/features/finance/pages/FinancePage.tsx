import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  Button,
  Reveal,
  EmptyResults,
  CardSkeleton,
  ListingHero,
  RelatedModules,
  RegionProvinceFilter,
  NearMeToggle,
} from '../../../shared/ui';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useNearMe } from '../../../shared/hooks/useNearMe';
import { useMoneyServices } from '../hooks/useMoneyServices';
import { MoneyServiceCard } from '../components/MoneyServiceCard';
import { MoneyFilters } from '../components/MoneyFilters';
import type { MoneyServiceSummary, MoneyServiceType } from '../types';
import styles from './FinancePage.module.css';

const PAGE_SIZE = 12;

export function FinancePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const urlType = (searchParams.get('type') as MoneyServiceType | null) ?? undefined;
  const urlRegion = searchParams.get('region') ?? undefined;
  const urlProvince = searchParams.get('province') ?? undefined;

  const nearMe = useNearMe({
    filtersKey: `${urlQuery}|${urlType ?? ''}|${urlRegion ?? ''}|${urlProvince ?? ''}`,
  });
  const [queryInput, setQueryInput] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(queryInput);
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<MoneyServiceSummary[]>([]);

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
  }, [urlQuery, urlType, urlRegion, urlProvince, nearMe.radiusKm]);

  const { data, isLoading, isFetching, isError, refetch } = useMoneyServices({
    q: urlQuery || undefined,
    type: urlType,
    region: urlRegion,
    province: urlProvince,
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

  function applyType(value: MoneyServiceType | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
      return next;
    });
  }

  function applyRegionProvince(regionValue: string | undefined, provinceValue: string | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (regionValue) next.set('region', regionValue);
      else next.delete('region');
      if (provinceValue) next.set('province', provinceValue);
      else next.delete('province');
      return next;
    });
  }

  const total = data?.total ?? 0;
  const hasMore = accumulated.length > 0 && accumulated.length < total;
  const showInitialLoading = isLoading && page === 1;

  return (
    <div className={styles.page}>
      <ListingHero
        title={t('finance.title')}
        subtitle={t('finance.subtitle')}
        searchPlaceholder={t('finance.searchPlaceholder')}
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
          onChange={applyRegionProvince}
          showProvince
        />
        <MoneyFilters active={urlType} onChange={applyType} />
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

        {!showInitialLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

        {!showInitialLoading && !isError && accumulated.length === 0 && (
          <EmptyResults
            variant="empty"
            title={t('finance.empty')}
            text={t('explore.emptyText')}
            onReset={() => {
              setQueryInput('');
              setSearchParams({});
            }}
          />
        )}

        {!showInitialLoading && !isError && accumulated.length > 0 && (
          <>
            <div className={styles.grid}>
              {accumulated.map((service, i) => (
                <Reveal key={service.id} delay={Math.min(i, 8) * 50}>
                  <MoneyServiceCard service={service} />
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

        <RelatedModules currentPath="/finance" />
      </div>
    </div>
  );
}

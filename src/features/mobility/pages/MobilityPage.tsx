import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  Button,
  Reveal,
  EmptyResults,
  CardSkeleton,
  RelatedModules,
  RegionProvinceFilter,
  NearMeToggle,
} from '../../../shared/ui';
import { useNearMe } from '../../../shared/hooks/useNearMe';
import { useTransportProviders } from '../hooks/useTransportProviders';
import { TransportCard } from '../components/TransportCard';
import { TransportFilters } from '../components/TransportFilters';
import type { TransportProviderSummary, TransportType } from '../types';
import styles from './MobilityPage.module.css';

const PAGE_SIZE = 12;

export function MobilityPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = (searchParams.get('type') as TransportType | null) ?? undefined;
  const urlRegion = searchParams.get('region') ?? undefined;
  const urlProvince = searchParams.get('province') ?? undefined;

  const nearMe = useNearMe({
    filtersKey: `${urlType ?? ''}|${urlRegion ?? ''}|${urlProvince ?? ''}`,
  });
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<TransportProviderSummary[]>([]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlType, urlRegion, urlProvince, nearMe.radiusKm]);

  const { data, isLoading, isFetching, isError, refetch } = useTransportProviders({
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
    nearMe.reportResult({
      resultCount: data?.total,
      isFetching,
      forRadiusKm: nearMe.radiusKm,
    });
  }, [nearMe, data?.total, isFetching]);

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  function applyType(value: TransportType | undefined) {
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
      <section className={styles.heroSimple}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('mobility.title')}</h1>
          <p className={styles.heroSubtitle}>{t('mobility.subtitle')}</p>
        </div>
      </section>

      <div className={styles.body}>
        <RegionProvinceFilter
          region={urlRegion}
          province={urlProvince}
          onChange={applyRegionProvince}
          showProvince
        />
        <TransportFilters active={urlType} onChange={applyType} />
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
            title={t('mobility.empty')}
            text={t('explore.emptyText')}
            onReset={() => applyType(undefined)}
          />
        )}

        {!showInitialLoading && !isError && accumulated.length > 0 && (
          <>
            <div className={styles.grid}>
              {accumulated.map((provider, i) => (
                <Reveal key={provider.id} delay={Math.min(i, 8) * 50}>
                  <TransportCard provider={provider} />
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

        <RelatedModules currentPath="/mobility" />
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, Reveal, EmptyResults, CardSkeleton, RelatedModules, RegionProvinceFilter } from '../../../shared/ui';
import { useMoneyServices } from '../hooks/useMoneyServices';
import { MoneyServiceCard } from '../components/MoneyServiceCard';
import { MoneyFilters } from '../components/MoneyFilters';
import type { MoneyServiceSummary, MoneyServiceType } from '../types';
import styles from './FinancePage.module.css';

const PAGE_SIZE = 12;

export function FinancePage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = (searchParams.get('type') as MoneyServiceType | null) ?? undefined;
  const urlRegion = searchParams.get('region') ?? undefined;
  const urlProvince = searchParams.get('province') ?? undefined;

  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<MoneyServiceSummary[]>([]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlType, urlRegion, urlProvince]);

  const { data, isLoading, isFetching, isError, refetch } = useMoneyServices({
    type: urlType,
    region: urlRegion,
    province: urlProvince,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

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
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('finance.title')}</h1>
          <p className={styles.heroSubtitle}>{t('finance.subtitle')}</p>
        </div>
      </section>

      <div className={styles.body}>
        <RegionProvinceFilter
          region={urlRegion}
          province={urlProvince}
          onChange={applyRegionProvince}
          showProvince
        />
        <MoneyFilters active={urlType} onChange={applyType} />

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
          <EmptyResults variant="empty" title={t('finance.empty')} text={t('explore.emptyText')} />
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

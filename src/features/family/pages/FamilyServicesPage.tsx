import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, Reveal, EmptyResults, CardSkeleton, ListingHero } from '../../../shared/ui';
import { useFamilyServices } from '../hooks/useFamilyServices';
import { FamilyServiceCard } from '../components/FamilyServiceCard';
import { FamilyServiceFilters } from '../components/FamilyServiceFilters';
import type { FamilyServiceSummary, FamilyServiceType } from '../types';
import styles from './FamilyServicesPage.module.css';

const PAGE_SIZE = 12;

export function FamilyServicesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = (searchParams.get('type') as FamilyServiceType | null) ?? undefined;

  const [queryInput, setQueryInput] = useState('');
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<FamilyServiceSummary[]>([]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlType]);

  const { data, isLoading, isFetching, isError, refetch } = useFamilyServices({
    type: urlType,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  function applyType(value: FamilyServiceType | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
      return next;
    });
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
        title={t('family.title')}
        subtitle={t('family.subtitle')}
        searchPlaceholder={t('family.searchPlaceholder')}
        searchLabel={t('common.search')}
        searchButtonLabel={t('common.search')}
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmit={() => {}}
      />

      <div className={styles.body}>
        <FamilyServiceFilters active={urlType} onChange={applyType} />

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
            title={t('family.empty')}
            text={t('explore.emptyText')}
            onReset={() => {
              setQueryInput('');
              setSearchParams({});
            }}
          />
        )}

        {!showInitialLoading && !isError && filtered.length > 0 && (
          <>
            <div className={styles.grid}>
              {filtered.map((service, i) => (
                <Reveal key={service.id} delay={Math.min(i, 8) * 50}>
                  <FamilyServiceCard service={service} />
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
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, Reveal, EmptyResults, CardSkeleton, RelatedModules } from '../../../shared/ui';
import { useConnectivityPoints } from '../hooks/useConnectivityPoints';
import { ConnectivityCard } from '../components/ConnectivityCard';
import { ConnectivityFilters } from '../components/ConnectivityFilters';
import type { ConnectivityPointSummary, ConnectivityPointType } from '../types';
import styles from './ConnectivityPage.module.css';

const PAGE_SIZE = 12;

export function ConnectivityPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = (searchParams.get('type') as ConnectivityPointType | null) ?? undefined;

  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<ConnectivityPointSummary[]>([]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlType]);

  const { data, isLoading, isFetching, isError, refetch } = useConnectivityPoints({
    type: urlType,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  function applyType(value: ConnectivityPointType | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
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
          <h1 className={styles.heroTitle}>{t('connectivity.title')}</h1>
          <p className={styles.heroSubtitle}>{t('connectivity.subtitle')}</p>
        </div>
      </section>

      <div className={styles.body}>
        <ConnectivityFilters active={urlType} onChange={applyType} />

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
          <EmptyResults variant="empty" title={t('connectivity.empty')} text={t('explore.emptyText')} />
        )}

        {!showInitialLoading && !isError && accumulated.length > 0 && (
          <>
            <div className={styles.grid}>
              {accumulated.map((point, i) => (
                <Reveal key={point.id} delay={Math.min(i, 8) * 50}>
                  <ConnectivityCard point={point} />
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

        <RelatedModules currentPath="/connectivity" />
      </div>
    </div>
  );
}

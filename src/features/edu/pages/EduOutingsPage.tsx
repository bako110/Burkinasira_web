import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, Reveal, EmptyResults, CardSkeleton, ListingHero } from '../../../shared/ui';
import { useEduOutings } from '../hooks/useEduOutings';
import { EduOutingCard } from '../components/EduOutingCard';
import { EduOutingFilters } from '../components/EduOutingFilters';
import type { EduOuting, EduOutingType } from '../types';
import styles from './EduOutingsPage.module.css';

const PAGE_SIZE = 12;

export function EduOutingsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = (searchParams.get('type') as EduOutingType | null) ?? undefined;

  const [queryInput, setQueryInput] = useState('');
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<EduOuting[]>([]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlType]);

  const { data, isLoading, isFetching, isError, refetch } = useEduOutings({
    type: urlType,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  function applyType(value: EduOutingType | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
      return next;
    });
  }

  const filtered = queryInput.trim()
    ? accumulated.filter((o) => o.title.toLowerCase().includes(queryInput.trim().toLowerCase()))
    : accumulated;

  const total = data?.total ?? 0;
  const hasMore = accumulated.length > 0 && accumulated.length < total;
  const showInitialLoading = isLoading && page === 1;

  return (
    <div className={styles.page}>
      <ListingHero
        title={t('edu.title')}
        subtitle={t('edu.subtitle')}
        searchPlaceholder={t('edu.searchPlaceholder')}
        searchLabel={t('common.search')}
        searchButtonLabel={t('common.search')}
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmit={() => {}}
      />

      <div className={styles.body}>
        <EduOutingFilters active={urlType} onChange={applyType} />

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
            title={t('edu.empty')}
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
              {filtered.map((outing, i) => (
                <Reveal key={outing.id} delay={Math.min(i, 8) * 50}>
                  <EduOutingCard outing={outing} />
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

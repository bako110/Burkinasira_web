import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

import { Button, Reveal, EmptyResults, CardSkeleton, RelatedModules } from '../../../shared/ui';
import { useHealthFacilities } from '../hooks/useHealthFacilities';
import { HealthFacilityCard } from '../components/HealthFacilityCard';
import { HealthFilters } from '../components/HealthFilters';
import type { HealthFacilitySummary, HealthFacilityType } from '../types';
import styles from './HealthPage.module.css';

const PAGE_SIZE = 12;

export function HealthPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlType = (searchParams.get('type') as HealthFacilityType | null) ?? undefined;
  const onDutyOnly = searchParams.get('on_duty') === '1';

  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<HealthFacilitySummary[]>([]);

  useEffect(() => {
    setPage(1);
    setAccumulated([]);
  }, [urlType, onDutyOnly]);

  const { data, isLoading, isFetching, isError, refetch } = useHealthFacilities({
    type: urlType,
    on_duty_only: onDutyOnly || undefined,
    page,
    page_size: PAGE_SIZE,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  }, [data, page]);

  function applyType(value: HealthFacilityType | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('type', value);
      else next.delete('type');
      return next;
    });
  }

  function toggleOnDuty() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (onDutyOnly) next.delete('on_duty');
      else next.set('on_duty', '1');
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
          <h1 className={styles.heroTitle}>{t('health.title')}</h1>
          <p className={styles.heroSubtitle}>{t('health.subtitle')}</p>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.filterRow}>
          <HealthFilters active={urlType} onChange={applyType} />
          <button
            type="button"
            className={clsx(styles.dutyToggle, onDutyOnly && styles.dutyToggleActive)}
            onClick={toggleOnDuty}
            aria-pressed={onDutyOnly}
          >
            <Clock size={15} strokeWidth={2} />
            {t('health.onDutyFilter')}
          </button>
        </div>

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
          <EmptyResults variant="empty" title={t('health.empty')} text={t('explore.emptyText')} />
        )}

        {!showInitialLoading && !isError && accumulated.length > 0 && (
          <>
            <div className={styles.grid}>
              {accumulated.map((facility, i) => (
                <Reveal key={facility.id} delay={Math.min(i, 8) * 50}>
                  <HealthFacilityCard facility={facility} />
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

        <RelatedModules currentPath="/health" />
      </div>
    </div>
  );
}

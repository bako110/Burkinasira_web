import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import { Button, Reveal, EmptyResults, CardSkeleton, ListingHero, RelatedModules, RegionProvinceFilter } from '../../../shared/ui';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useProducts } from '../hooks/useProducts';
import { useArtisans } from '../hooks/useArtisans';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { ArtisanCard } from '../components/ArtisanCard';
import type { ProductCategory, ProductSummary } from '../types';
import styles from './MarketPage.module.css';

const PAGE_SIZE = 15;

type Tab = 'products' | 'artisans';

export function MarketPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('products');

  const urlQuery = searchParams.get('q') ?? '';
  const urlCategory = (searchParams.get('category') as ProductCategory | null) ?? undefined;
  const urlRegion = searchParams.get('region') ?? undefined;
  const urlProvince = searchParams.get('province') ?? undefined;

  const [queryInput, setQueryInput] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(queryInput);
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<ProductSummary[]>([]);

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
  }, [urlQuery, urlCategory]);

  const { data, isLoading, isFetching, isError, refetch } = useProducts({
    q: urlQuery || undefined,
    category: urlCategory,
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

  function applyCategory(value: ProductCategory | undefined) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set('category', value);
      else next.delete('category');
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

  const {
    data: artisans,
    isLoading: isLoadingArtisans,
    isError: isArtisansError,
    refetch: refetchArtisans,
  } = useArtisans({ region: urlRegion, province: urlProvince });

  const total = data?.total ?? 0;
  const hasMore = accumulated.length > 0 && accumulated.length < total;
  const showInitialLoading = isLoading && page === 1;

  return (
    <div className={styles.page}>
      <ListingHero
        title={t('market.title')}
        subtitle={t('market.subtitle')}
        searchPlaceholder={t('market.searchPlaceholder')}
        searchLabel={t('common.search')}
        searchButtonLabel={t('common.search')}
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmit={applySearch}
      />

      <div className={styles.body}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'products' && styles.tabActive)}
            onClick={() => setTab('products')}
          >
            {t('market.tabProducts')}
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'artisans' && styles.tabActive)}
            onClick={() => setTab('artisans')}
          >
            {t('market.tabArtisans')}
          </button>
        </div>

        {tab === 'products' && (
          <>
            <ProductFilters active={urlCategory} onChange={applyCategory} />

            {!showInitialLoading && !isError && (
              <p className={styles.resultsCount}>{t('explore.resultsCount', { count: total })}</p>
            )}

            {showInitialLoading && (
              <div className={styles.grid}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {!showInitialLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

            {!showInitialLoading && !isError && accumulated.length === 0 && (
              <EmptyResults variant="empty" title={t('market.empty')} text={t('explore.emptyText')} />
            )}

            {!showInitialLoading && !isError && accumulated.length > 0 && (
              <>
                <div className={styles.grid}>
                  {accumulated.map((product, i) => (
                    <Reveal key={product.id} delay={Math.min(i, 10) * 40}>
                      <ProductCard product={product} />
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
          </>
        )}

        {tab === 'artisans' && (
          <>
            <RegionProvinceFilter
              region={urlRegion}
              province={urlProvince}
              onChange={applyRegionProvince}
              showProvince
            />

            {!isLoadingArtisans && !isArtisansError && (
              <p className={styles.resultsCount}>{t('explore.resultsCount', { count: artisans?.length ?? 0 })}</p>
            )}

            {isLoadingArtisans && (
              <div className={styles.artisanList}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {!isLoadingArtisans && isArtisansError && (
              <EmptyResults variant="error" onRetry={() => refetchArtisans()} />
            )}

            {!isLoadingArtisans && !isArtisansError && (!artisans || artisans.length === 0) && (
              <EmptyResults variant="empty" title={t('market.emptyArtisans')} text={t('explore.emptyText')} />
            )}

            {!isLoadingArtisans && !isArtisansError && artisans && artisans.length > 0 && (
              <div className={styles.artisanList}>
                {artisans.map((artisan, i) => (
                  <Reveal key={artisan.id} delay={Math.min(i, 8) * 50}>
                    <ArtisanCard artisan={artisan} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

        <RelatedModules currentPath="/market" />
      </div>
    </div>
  );
}

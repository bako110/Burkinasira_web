import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, FileText } from 'lucide-react';
import clsx from 'clsx';

import { Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyQuoteRequests } from '../hooks/useMyQuoteRequests';
import { QuoteRequestCard } from '../components/QuoteRequestCard';
import type { QuoteRequestStatus } from '../types';
import styles from './MyQuoteRequestsPage.module.css';

type Filter = 'all' | 'pending' | 'quoted' | 'accepted' | 'declined';

const FILTERS: Filter[] = ['all', 'pending', 'quoted', 'accepted', 'declined'];

function filterOf(status: QuoteRequestStatus): Exclude<Filter, 'all'> {
  if (status === 'submitted' || status === 'in_review') return 'pending';
  return status;
}

export function MyQuoteRequestsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMyQuoteRequests();
  const [filter, setFilter] = useState<Filter>('all');

  const quotes = useMemo(() => data ?? [], [data]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: quotes.length, pending: 0, quoted: 0, accepted: 0, declined: 0 };
    quotes.forEach((q) => {
      c[filterOf(q.status)] += 1;
    });
    return c;
  }, [quotes]);

  const visible = useMemo(
    () => (filter === 'all' ? quotes : quotes.filter((q) => filterOf(q.status) === filter)),
    [quotes, filter],
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.kicker}>
            <Briefcase size={13} strokeWidth={2} />
            {t('nav.business')}
          </span>
          <h1 className={styles.title}>{t('business.title')}</h1>
          <p className={styles.subtitle}>{t('business.subtitle')}</p>
          <div className={styles.heroFooter}>
            <button type="button" className={styles.newBtn} onClick={() => navigate('/business/new')}>
              <PlusCircle size={18} strokeWidth={2} />
              {t('business.newQuoteButton')}
            </button>
            {!isLoading && !isError && quotes.length > 0 && (
              <div className={styles.heroStats}>
                <span className={styles.statChip}>
                  <FileText size={14} strokeWidth={2} />
                  {t('business.list.total', { count: counts.all })}
                </span>
                {counts.quoted > 0 && (
                  <span className={clsx(styles.statChip, styles.statChipHot)}>
                    {t('business.list.quotedCount', { count: counts.quoted })}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>{t('business.myQuotes')}</h2>

        {quotes.length > 0 && (
          <div className={styles.filters} role="tablist" aria-label={t('business.list.filters')}>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={clsx(styles.filterTab, filter === f && styles.filterTabActive)}
                onClick={() => setFilter(f)}
                disabled={f !== 'all' && counts[f] === 0}
              >
                {t(`business.list.filter.${f}`)}
                <span className={styles.filterCount}>{counts[f]}</span>
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

        {!isLoading && !isError && quotes.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Briefcase size={30} strokeWidth={1.5} />
            </span>
            <h3 className={styles.emptyTitle}>{t('business.myQuotesEmpty')}</h3>
            <p className={styles.emptyText}>{t('business.list.emptyText')}</p>
            <button type="button" className={styles.emptyBtn} onClick={() => navigate('/business/new')}>
              <PlusCircle size={16} strokeWidth={2} />
              {t('business.newQuoteButton')}
            </button>
          </div>
        )}

        {!isLoading && !isError && visible.length > 0 && (
          <div key={filter} className={styles.grid}>
            {visible.map((quote, i) => (
              <Reveal key={quote.id} delay={Math.min(i, 8) * 60}>
                <QuoteRequestCard quote={quote} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

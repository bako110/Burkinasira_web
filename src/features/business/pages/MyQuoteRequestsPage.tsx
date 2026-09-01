import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase } from 'lucide-react';

import { Button, Reveal, EmptyResults, CardSkeleton } from '../../../shared/ui';
import { useMyQuoteRequests } from '../hooks/useMyQuoteRequests';
import { QuoteRequestCard } from '../components/QuoteRequestCard';
import styles from './MyQuoteRequestsPage.module.css';

export function MyQuoteRequestsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMyQuoteRequests();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Briefcase size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className={styles.title}>{t('business.title')}</h1>
          <p className={styles.subtitle}>{t('business.subtitle')}</p>
        </div>
      </div>

      <Button onClick={() => navigate('/business/new')}>
        <PlusCircle size={16} strokeWidth={2} />
        {t('business.newQuoteButton')}
      </Button>

      <h2 className={styles.sectionTitle}>{t('business.myQuotes')}</h2>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('business.myQuotesEmpty')} text={t('bookings.emptyText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((quote, i) => (
            <Reveal key={quote.id} delay={Math.min(i, 8) * 50}>
              <QuoteRequestCard quote={quote} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

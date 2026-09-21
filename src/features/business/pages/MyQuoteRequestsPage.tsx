import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase } from 'lucide-react';

import { Button, Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyQuoteRequests } from '../hooks/useMyQuoteRequests';
import { QuoteRequestCard } from '../components/QuoteRequestCard';
import styles from './MyQuoteRequestsPage.module.css';

export function MyQuoteRequestsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useMyQuoteRequests();

  return (
    <div className={styles.page}>
      <Reveal className={styles.hero}>
        <DetailBackButton fallbackTo="/" className={styles.backBtn} />
        <div className={styles.heroText}>
          <span className={styles.kicker}>
            <Briefcase size={13} strokeWidth={2} />
            {t('nav.business', 'Tourisme d’affaires')}
          </span>
          <h1 className={styles.title}>{t('business.title')}</h1>
          <p className={styles.subtitle}>{t('business.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/business/new')} className={styles.newButton}>
          <PlusCircle size={16} strokeWidth={2} />
          {t('business.newQuoteButton')}
        </Button>
      </Reveal>

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
        <div className={styles.emptyWrap}>
          <EmptyResults variant="empty" title={t('business.myQuotesEmpty')} text={t('bookings.emptyText')} />
          <Button variant="secondary" onClick={() => navigate('/business/new')}>
            <PlusCircle size={16} strokeWidth={2} />
            {t('business.newQuoteButton')}
          </Button>
        </div>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((quote, i) => (
            <Reveal key={quote.id} delay={Math.min(i, 8) * 60}>
              <QuoteRequestCard quote={quote} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

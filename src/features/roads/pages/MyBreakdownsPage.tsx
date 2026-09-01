import { useTranslation } from 'react-i18next';
import { Calendar, FileText } from 'lucide-react';
import clsx from 'clsx';

import { Card, Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyBreakdowns } from '../hooks/useMyBreakdowns';
import styles from './MyBreakdownsPage.module.css';

export function MyBreakdownsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyBreakdowns();

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('roads.myBreakdowns')}</h1>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('roads.myBreakdownsEmpty')} text={t('bookings.emptyText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((report, i) => (
            <Reveal key={report.id} delay={Math.min(i, 8) * 50}>
              <Card className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={clsx(styles.statusBadge, styles[`status_${report.status}`])}>
                    {t(`roads.breakdownStatus.${report.status}`)}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <Calendar size={14} strokeWidth={2} />
                  <span>{new Date(report.created_at).toLocaleString('fr-FR')}</span>
                </div>
                {report.description && (
                  <div className={styles.cardRow}>
                    <FileText size={14} strokeWidth={2} />
                    <span>{report.description}</span>
                  </div>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

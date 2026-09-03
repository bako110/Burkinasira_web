import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flag, Check, X, Eye, Clock } from 'lucide-react';

import { Spinner, EmptyResults } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useReceivedReports, useModerateReceivedReport } from '../hooks/useReceivedReports';
import type { DataErrorReport, DataErrorReportStatus } from '../types';
import styles from './ReceivedReportsTab.module.css';

const STATUS_ORDER: DataErrorReportStatus[] = ['reported', 'reviewing', 'corrected', 'dismissed'];
const OPEN_STATUSES: DataErrorReportStatus[] = ['reported', 'reviewing'];

function ReportCard({ report }: { report: DataErrorReport }) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const moderate = useModerateReceivedReport();

  function setStatus(status: DataErrorReportStatus) {
    moderate.mutate(
      { id: report.id, payload: { status } },
      {
        onSuccess: () => push({ variant: 'success', message: t('proReports.updated') }),
        onError: (err) =>
          push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  const isOpen = OPEN_STATUSES.includes(report.status);

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <span className={styles.itemType}>
          <Flag size={13} strokeWidth={2} />
          {t(`proReports.itemTypes.${report.item_type}`, report.item_type)}
        </span>
        <span className={styles[`badge_${report.status}`]}>
          {t(`proReports.status.${report.status}`)}
        </span>
      </header>

      <p className={styles.description}>{report.description}</p>

      <footer className={styles.cardFooter}>
        <span className={styles.date}>{new Date(report.created_at).toLocaleDateString()}</span>

        {isOpen && (
          <div className={styles.actions}>
            {report.status === 'reported' && (
              <button
                type="button"
                className={styles.actionGhost}
                onClick={() => setStatus('reviewing')}
                disabled={moderate.isPending}
              >
                <Eye size={13} strokeWidth={2} />
                {t('proReports.markReviewing')}
              </button>
            )}
            <button
              type="button"
              className={styles.actionPrimary}
              onClick={() => setStatus('corrected')}
              disabled={moderate.isPending}
            >
              <Check size={13} strokeWidth={2.5} />
              {t('proReports.markCorrected')}
            </button>
            <button
              type="button"
              className={styles.actionGhost}
              onClick={() => setStatus('dismissed')}
              disabled={moderate.isPending}
            >
              <X size={13} strokeWidth={2} />
              {t('proReports.markDismissed')}
            </button>
          </div>
        )}
      </footer>
    </article>
  );
}

export function ReceivedReportsTab() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'open' | 'all'>('open');
  const { data, isLoading } = useReceivedReports();

  const sorted = useMemo(() => {
    const list = data ?? [];
    const visible = filter === 'open' ? list.filter((r) => OPEN_STATUSES.includes(r.status)) : list;
    return [...visible].sort((a, b) => {
      const sa = STATUS_ORDER.indexOf(a.status);
      const sb = STATUS_ORDER.indexOf(b.status);
      if (sa !== sb) return sa - sb;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [data, filter]);

  const openCount = (data ?? []).filter((r) => OPEN_STATUSES.includes(r.status)).length;

  if (isLoading) return <Spinner size={22} />;

  if (!data || data.length === 0) {
    return (
      <EmptyResults
        variant="empty"
        title={t('proReports.emptyTitle')}
        text={t('proReports.emptyText')}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <button
            type="button"
            className={filter === 'open' ? styles.filterChipActive : styles.filterChip}
            onClick={() => setFilter('open')}
          >
            <Clock size={13} strokeWidth={2} />
            {t('proReports.filterOpen')}
            {openCount > 0 && <span className={styles.countPill}>{openCount}</span>}
          </button>
          <button
            type="button"
            className={filter === 'all' ? styles.filterChipActive : styles.filterChip}
            onClick={() => setFilter('all')}
          >
            {t('proReports.filterAll')}
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyResults variant="empty" title={t('proReports.noOpenTitle')} text={t('proReports.noOpenText')} />
      ) : (
        <div className={styles.list}>
          {sorted.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}

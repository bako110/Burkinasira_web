import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Wallet, Receipt, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

import { Spinner, Reveal } from '../../../shared/ui';
import { useMyGuideAnalytics, useMyProviderAnalytics } from '../hooks/useGuideAnalytics';
import type { GuideAnalyticsSummary, ProviderItemType } from '../types';
import { StatTile } from './StatTile';
import { AreaTrendChart } from './AreaTrendChart';
import styles from './AnalyticsTab.module.css';

const PERIODS = [
  { key: 'daily', labelKey: 'pro.periodDaily' },
  { key: 'monthly', labelKey: 'pro.periodMonthly' },
  { key: 'yearly', labelKey: 'pro.periodYearly' },
] as const;
type PeriodKey = (typeof PERIODS)[number]['key'];

const BRAND_COLOR = 'var(--color-brand)';
const REVENUE_COLOR = 'var(--color-success)';

function formatDayLabel(period: string): string {
  const d = new Date(period);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function formatMonthLabel(period: string): string {
  const [year, month] = period.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
}

function formatYearLabel(period: string): string {
  return period;
}

interface AnalyticsTabProps {
  source?: { itemType: ProviderItemType; itemId: string | undefined };
}

function useAnalyticsSource(source?: AnalyticsTabProps['source']) {
  const guideQuery = useMyGuideAnalytics();
  const providerQuery = useMyProviderAnalytics(source?.itemType ?? 'hotel', source?.itemId);
  return source ? providerQuery : guideQuery;
}

export function AnalyticsTab({ source }: AnalyticsTabProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useAnalyticsSource(source);

  if (isLoading || !data) {
    return <Spinner size={22} />;
  }

  return <AnalyticsTabContent data={data} t={t} />;
}

function AnalyticsTabContent({
  data,
  t,
}: {
  data: GuideAnalyticsSummary;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const [period, setPeriod] = useState<PeriodKey>('daily');

  const currencyFormatter = (value: number) => `${value.toLocaleString('fr-FR')} ${data.currency}`;
  const countFormatter = (value: number) => value.toLocaleString('fr-FR');

  const formatPeriod =
    period === 'daily' ? formatDayLabel : period === 'monthly' ? formatMonthLabel : formatYearLabel;
  const points = data[period];

  return (
    <div className={styles.container}>
      <div className={styles.statGrid}>
        <Reveal delay={0}>
          <StatTile label={t('pro.statTotalCustomers')} value={countFormatter(data.total_customers)} Icon={Users} />
        </Reveal>
        <Reveal delay={50}>
          <StatTile label={t('pro.statTotalRevenue')} value={currencyFormatter(data.total_revenue)} Icon={Wallet} />
        </Reveal>
        <Reveal delay={100}>
          <StatTile
            label={t('pro.statAverageBooking')}
            value={currencyFormatter(data.average_booking_value)}
            Icon={Receipt}
          />
        </Reveal>
        <Reveal delay={150}>
          <StatTile
            label={t('pro.statCompletionRate')}
            value={`${data.completion_rate}%`}
            Icon={CheckCircle2}
          />
        </Reveal>
      </div>

      <Reveal as="section" className={styles.section} delay={80}>
        <div className={styles.periodTabs}>
          {PERIODS.map(({ key, labelKey }) => (
            <button
              key={key}
              type="button"
              className={clsx(styles.periodTab, period === key && styles.periodTabActive)}
              onClick={() => setPeriod(key)}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        <div className={styles.chartPair}>
          <AreaTrendChart
            title={t('pro.chartCustomers')}
            points={points.map((p) => ({ period: p.period, value: p.customer_count }))}
            color={BRAND_COLOR}
            formatValue={countFormatter}
            formatPeriod={formatPeriod}
            totalLabel={countFormatter(points.reduce((s, p) => s + p.customer_count, 0))}
          />
          <AreaTrendChart
            title={t('pro.chartRevenue')}
            points={points.map((p) => ({ period: p.period, value: p.revenue }))}
            color={REVENUE_COLOR}
            formatValue={currencyFormatter}
            formatPeriod={formatPeriod}
            totalLabel={currencyFormatter(points.reduce((s, p) => s + p.revenue, 0))}
          />
        </div>
      </Reveal>
    </div>
  );
}

import { useTranslation } from 'react-i18next';

import { Spinner } from '../../../shared/ui';
import { useMyGuideAnalytics } from '../hooks/useGuideAnalytics';
import { StatTile } from './StatTile';
import { AreaTrendChart } from './AreaTrendChart';
import styles from './AnalyticsTab.module.css';

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

export function AnalyticsTab() {
  const { t } = useTranslation();
  const { data, isLoading } = useMyGuideAnalytics();

  if (isLoading || !data) {
    return <Spinner size={22} />;
  }

  const currencyFormatter = (value: number) => `${value.toLocaleString('fr-FR')} ${data.currency}`;
  const countFormatter = (value: number) => value.toLocaleString('fr-FR');

  return (
    <div className={styles.container}>
      <div className={styles.statGrid}>
        <StatTile label={t('pro.statTotalCustomers')} value={countFormatter(data.total_customers)} />
        <StatTile label={t('pro.statTotalRevenue')} value={currencyFormatter(data.total_revenue)} />
        <StatTile label={t('pro.statAverageBooking')} value={currencyFormatter(data.average_booking_value)} />
        <StatTile label={t('pro.statCompletionRate')} value={`${data.completion_rate}%`} />
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('pro.analyticsDaily')}</h3>
        <div className={styles.chartPair}>
          <AreaTrendChart
            title={t('pro.chartCustomers')}
            points={data.daily.map((p) => ({ period: p.period, value: p.customer_count }))}
            color={BRAND_COLOR}
            formatValue={countFormatter}
            formatPeriod={formatDayLabel}
            totalLabel={countFormatter(data.daily.reduce((s, p) => s + p.customer_count, 0))}
          />
          <AreaTrendChart
            title={t('pro.chartRevenue')}
            points={data.daily.map((p) => ({ period: p.period, value: p.revenue }))}
            color={REVENUE_COLOR}
            formatValue={currencyFormatter}
            formatPeriod={formatDayLabel}
            totalLabel={currencyFormatter(data.daily.reduce((s, p) => s + p.revenue, 0))}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('pro.analyticsMonthly')}</h3>
        <div className={styles.chartPair}>
          <AreaTrendChart
            title={t('pro.chartCustomers')}
            points={data.monthly.map((p) => ({ period: p.period, value: p.customer_count }))}
            color={BRAND_COLOR}
            formatValue={countFormatter}
            formatPeriod={formatMonthLabel}
            totalLabel={countFormatter(data.monthly.reduce((s, p) => s + p.customer_count, 0))}
          />
          <AreaTrendChart
            title={t('pro.chartRevenue')}
            points={data.monthly.map((p) => ({ period: p.period, value: p.revenue }))}
            color={REVENUE_COLOR}
            formatValue={currencyFormatter}
            formatPeriod={formatMonthLabel}
            totalLabel={currencyFormatter(data.monthly.reduce((s, p) => s + p.revenue, 0))}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>{t('pro.analyticsYearly')}</h3>
        <div className={styles.chartPair}>
          <AreaTrendChart
            title={t('pro.chartCustomers')}
            points={data.yearly.map((p) => ({ period: p.period, value: p.customer_count }))}
            color={BRAND_COLOR}
            formatValue={countFormatter}
            formatPeriod={formatYearLabel}
            totalLabel={countFormatter(data.yearly.reduce((s, p) => s + p.customer_count, 0))}
          />
          <AreaTrendChart
            title={t('pro.chartRevenue')}
            points={data.yearly.map((p) => ({ period: p.period, value: p.revenue }))}
            color={REVENUE_COLOR}
            formatValue={currencyFormatter}
            formatPeriod={formatYearLabel}
            totalLabel={currencyFormatter(data.yearly.reduce((s, p) => s + p.revenue, 0))}
          />
        </div>
      </div>
    </div>
  );
}

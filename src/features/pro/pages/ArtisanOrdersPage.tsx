import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { Spinner, EmptyResults, Reveal } from '../../../shared/ui';
import { useReceivedOrders } from '../../market/hooks/useOrders';
import type { ArtisanOrderStatus } from '../../market/types';
import { ReceivedOrderCard } from '../components/ReceivedOrderCard';
import { ProPageHeader } from '../components/ProPageHeader';
import pageStyles from './ProPageWrapper.module.css';
import ordersStyles from '../../market/pages/MyOrdersPage.module.css';
import filterStyles from '../components/BookingsTab.module.css';

const STATUS_TABS: { value: ArtisanOrderStatus | 'all'; labelKey: string }[] = [
  { value: 'all', labelKey: 'pro.filterAll' },
  { value: 'pending', labelKey: 'market.orderStatus.pending' },
  { value: 'confirmed', labelKey: 'market.orderStatus.confirmed' },
  { value: 'handed_to_agency', labelKey: 'market.orderStatus.handed_to_agency' },
  { value: 'in_delivery', labelKey: 'market.orderStatus.in_delivery' },
  { value: 'delivered', labelKey: 'market.orderStatus.delivered' },
  { value: 'cancelled', labelKey: 'market.orderStatus.cancelled' },
];

export function ArtisanOrdersPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<ArtisanOrderStatus | 'all'>('all');
  const { data, isLoading, isError, refetch } = useReceivedOrders(statusFilter === 'all' ? undefined : statusFilter);

  return (
    <div className={pageStyles.page}>
      <ProPageHeader title={t('pro.receivedOrdersTitle')} subtitle={t('pro.receivedOrdersSubtitle')} />

      <div className={filterStyles.filters}>
        {STATUS_TABS.map(({ value, labelKey }) => (
          <button
            key={value}
            type="button"
            className={clsx(filterStyles.filterButton, statusFilter === value && filterStyles.filterButtonActive)}
            onClick={() => setStatusFilter(value)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}>
          <Spinner size={26} />
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('pro.noOrdersReceived')} text={t('pro.noOrdersReceivedText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={ordersStyles.grid}>
          {data.map((order, i) => (
            <Reveal key={order.id} delay={Math.min(i, 8) * 50}>
              <ReceivedOrderCard order={order} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

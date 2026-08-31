import { useTranslation } from 'react-i18next';

import { Reveal, EmptyResults, CardSkeleton, DetailBackButton } from '../../../shared/ui';
import { useMyOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/OrderCard';
import styles from './MyOrdersPage.module.css';

export function MyOrdersPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useMyOrders();

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/profile" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('market.ordersTitle')}</h1>

      {isLoading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyResults variant="empty" title={t('market.ordersEmpty')} text={t('market.ordersEmptyText')} />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className={styles.grid}>
          {data.map((order, i) => (
            <Reveal key={order.id} delay={Math.min(i, 8) * 50}>
              <OrderCard order={order} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { Calendar, Truck } from 'lucide-react';
import clsx from 'clsx';

import { Card, Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { useUpdateOrderStatus } from '../../market/hooks/useOrders';
import type { OrderWithProduct } from '../../market/hooks/useOrders';
import type { ArtisanOrderStatus } from '../../market/types';
import { ProductImagePlaceholder } from '../../market/components/ProductImagePlaceholder';
import styles from '../../market/components/OrderCard.module.css';

const STATUS_TONE: Record<string, string> = {
  pending: 'tonePending',
  confirmed: 'toneConfirmed',
  handed_to_agency: 'toneConfirmed',
  in_delivery: 'toneConfirmed',
  delivered: 'toneCompleted',
  cancelled: 'toneCancelled',
  returned: 'toneRefunded',
};

// Prochaine étape proposée en un clic (transitions ARTISAN_ORDER_TRANSITIONS
// côté backend) ; annulation/retour restent des actions volontaires distinctes.
const NEXT_STEP: Partial<Record<ArtisanOrderStatus, ArtisanOrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'handed_to_agency',
  handed_to_agency: 'in_delivery',
  in_delivery: 'delivered',
};

export function ReceivedOrderCard({ order }: { order: OrderWithProduct }) {
  const { t, i18n } = useTranslation();
  const push = useToastStore((s) => s.push);
  const updateStatus = useUpdateOrderStatus();
  const tone = STATUS_TONE[order.status] ?? 'tonePending';
  const nextStep = NEXT_STEP[order.status as ArtisanOrderStatus];
  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  function handleStatusChange(status: ArtisanOrderStatus) {
    updateStatus.mutate(
      { orderId: order.id, payload: { status } },
      {
        onSuccess: () => push({ variant: 'success', message: t('pro.orderStatusUpdated') }),
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      },
    );
  }

  return (
    <Card className={styles.card}>
      <div className={styles.imageWrap}>
        {order.product_photo ? (
          <img src={order.product_photo} alt="" className={styles.image} />
        ) : (
          <ProductImagePlaceholder category={order.product_category} iconSize={22} />
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.title}>{order.product_name ?? t('market.orderProductUnavailable')}</h3>
          <span className={clsx(styles.status, styles[tone])}>
            {t(`market.orderStatus.${order.status}`, order.status)}
          </span>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Calendar size={14} strokeWidth={2} />
            {new Date(order.created_at).toLocaleDateString(i18n.language)}
          </span>
          <span className={styles.metaItem}>{t('market.orderQuantity', { count: order.quantity })}</span>
          <span className={styles.metaItem}>{t(`market.fulfillment.${order.fulfillment_mode}`)}</span>
          {order.delivery_region && (
            <span className={styles.metaItem}>
              <Truck size={14} strokeWidth={2} />
              {order.delivery_region}
              {order.delivery_address ? ` · ${order.delivery_address}` : ''}
            </span>
          )}
        </div>

        <div className={styles.footer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className={styles.price}>
            {order.total_price.toLocaleString('fr-FR')} {order.currency}
          </span>

          {(nextStep || canCancel) && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {canCancel && (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={updateStatus.isPending}
                  onClick={() => handleStatusChange('cancelled')}
                >
                  {t('pro.orderCancel')}
                </Button>
              )}
              {nextStep && (
                <Button size="sm" disabled={updateStatus.isPending} onClick={() => handleStatusChange(nextStep)}>
                  {updateStatus.isPending ? <Spinner size={14} /> : t(`pro.orderAdvanceTo_${nextStep}`)}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

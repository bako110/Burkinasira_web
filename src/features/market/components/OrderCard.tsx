import { useTranslation } from 'react-i18next';
import { ImageOff, Calendar, Truck } from 'lucide-react';
import clsx from 'clsx';

import { Card } from '../../../shared/ui';
import type { OrderWithProduct } from '../hooks/useOrders';
import styles from './OrderCard.module.css';

const STATUS_TONE: Record<string, string> = {
  pending: 'tonePending',
  confirmed: 'toneConfirmed',
  cancelled: 'toneCancelled',
  completed: 'toneCompleted',
  refunded: 'toneRefunded',
};

export function OrderCard({ order }: { order: OrderWithProduct }) {
  const { t, i18n } = useTranslation();
  const tone = STATUS_TONE[order.status] ?? 'tonePending';

  return (
    <Card className={styles.card}>
      <div className={styles.imageWrap}>
        {order.product_photo ? (
          <img src={order.product_photo} alt="" className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <ImageOff size={20} strokeWidth={1.5} />
          </div>
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
          <span className={styles.metaItem}>
            {t('market.orderQuantity', { count: order.quantity })}
          </span>
          <span className={styles.metaItem}>{t(`market.fulfillment.${order.fulfillment_mode}`)}</span>
          {order.delivery_region && (
            <span className={styles.metaItem}>
              <Truck size={14} strokeWidth={2} />
              {order.delivery_region}
            </span>
          )}
        </div>

        {order.delivery_fee > 0 && (
          <div className={styles.breakdown}>
            <span>
              {t('market.cartSubtotal')} : {order.subtotal.toLocaleString('fr-FR')} {order.currency}
            </span>
            <span>
              {t('market.deliveryFee')} : {order.delivery_fee.toLocaleString('fr-FR')} {order.currency}
              {order.delivery_provider ? ` · ${order.delivery_provider}` : ''}
            </span>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>
            {order.total_price.toLocaleString('fr-FR')} {order.currency}
          </span>
        </div>
      </div>
    </Card>
  );
}

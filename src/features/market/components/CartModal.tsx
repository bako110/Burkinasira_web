import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Trash2, ImageOff, CheckCircle2, ShoppingBag } from 'lucide-react';

import { Modal, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useCartStore } from '../../../store/cart.store';
import { useCreateOrder } from '../hooks/useOrders';
import type { FulfillmentMode } from '../types';
import styles from './CartModal.module.css';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

export function CartModal({ open, onClose }: CartModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const removeItems = useCartStore((s) => s.removeItems);
  const clear = useCartStore((s) => s.clear);
  const { mutateAsync: createOrder } = useCreateOrder();

  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('les_deux');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [failedItemNames, setFailedItemNames] = useState<string[]>([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const currency = items[0]?.currency ?? 'XOF';

  function handleClose() {
    setIsSuccess(false);
    setCheckoutError(null);
    setFailedItemNames([]);
    onClose();
  }

  function handleViewOrders() {
    handleClose();
    navigate('/market/orders');
  }

  async function handleCheckout() {
    requireAuth(async () => {
      setIsCheckingOut(true);
      setCheckoutError(null);
      const succeededIds: string[] = [];
      const failedNames: string[] = [];

      for (const item of items) {
        try {
          await createOrder({
            product_id: item.product_id,
            quantity: item.quantity,
            fulfillment_mode: fulfillmentMode,
          });
          succeededIds.push(item.product_id);
        } catch {
          failedNames.push(item.name);
        }
      }

      setIsCheckingOut(false);
      if (succeededIds.length > 0) {
        removeItems(succeededIds);
      }

      if (failedNames.length === 0) {
        setIsSuccess(true);
      } else if (succeededIds.length > 0) {
        setFailedItemNames(failedNames);
        setCheckoutError(t('market.orderPartialError'));
        setIsSuccess(true);
      } else {
        setCheckoutError(t('market.orderPartialError'));
      }
    }, t('market.cartCheckoutRequiresAuth'));
  }

  return (
    <Modal open={open} onClose={handleClose} title={t('market.cartTitle')}>
      {isSuccess ? (
        <div className={styles.success}>
          <CheckCircle2 size={40} strokeWidth={1.5} className={styles.successIcon} />
          <p className={styles.successTitle}>{t('market.orderPlaced')}</p>
          <p className={styles.successText}>{t('market.orderPlacedText')}</p>
          {checkoutError && (
            <div className={styles.partialError}>
              <p className={styles.error}>{checkoutError}</p>
              {failedItemNames.length > 0 && (
                <ul className={styles.failedList}>
                  {failedItemNames.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <Button fullWidth onClick={handleViewOrders}>
            {t('market.viewMyOrders')}
          </Button>
          <Button fullWidth variant="ghost" onClick={handleClose}>
            {t('common.back')}
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingBag size={36} strokeWidth={1.5} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>{t('market.cartEmpty')}</p>
          <p className={styles.emptyText}>{t('market.cartEmptyText')}</p>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.itemList}>
            {items.map((item) => (
              <div key={item.product_id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.photo ? (
                    <img src={item.photo} alt="" />
                  ) : (
                    <ImageOff size={18} strokeWidth={1.5} />
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  {item.artisan_name && (
                    <span className={styles.itemArtisan}>{t('market.cartSoldBy', { name: item.artisan_name })}</span>
                  )}
                  <span className={styles.itemPrice}>
                    {item.price.toLocaleString('fr-FR')} {item.currency}
                  </span>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.quantityControls}>
                    <button
                      type="button"
                      className={styles.quantityBtn}
                      onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      type="button"
                      className={styles.quantityBtn}
                      onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.stock_quantity !== undefined && item.quantity >= item.stock_quantity}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.product_id)}
                    aria-label={t('market.cartRemove')}
                  >
                    <Trash2 size={15} strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.fulfillmentField}>
            <span className={styles.fulfillmentLabel}>{t('market.fulfillmentMode')}</span>
            <select
              className={styles.fulfillmentSelect}
              value={fulfillmentMode}
              onChange={(e) => setFulfillmentMode(e.target.value as FulfillmentMode)}
            >
              <option value="les_deux">{t('market.fulfillment.les_deux')}</option>
              <option value="livraison">{t('market.fulfillment.livraison')}</option>
              <option value="retrait">{t('market.fulfillment.retrait')}</option>
            </select>
          </div>

          <div className={styles.totalRow}>
            <span>{t('market.cartTotal')}</span>
            <strong>
              {total.toLocaleString('fr-FR')} {currency}
            </strong>
          </div>

          {checkoutError && <p className={styles.error}>{checkoutError}</p>}

          <div className={styles.actions}>
            <Button variant="secondary" onClick={clear} disabled={isCheckingOut}>
              {t('market.cartClear')}
            </Button>
            <Button fullWidth onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? t('common.loading') : t('market.cartCheckout')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

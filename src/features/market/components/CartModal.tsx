import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle2, ShoppingBag, Truck } from 'lucide-react';

import { Modal, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BURKINA_REGION_NAMES } from '../../../shared/data/burkinaRegions';
import { useCartStore } from '../../../store/cart.store';
import { useCreateOrder, useDeliveryFeeQuote } from '../hooks/useOrders';
import type { OrderFulfillmentMode } from '../types';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
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

  const [fulfillmentMode, setFulfillmentMode] = useState<OrderFulfillmentMode>('retrait');
  const [deliveryRegion, setDeliveryRegion] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [failedItemNames, setFailedItemNames] = useState<string[]>([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const currency = items[0]?.currency ?? 'XOF';
  const isDelivery = fulfillmentMode === 'livraison';

  const {
    data: feeQuote,
    isFetching: isQuoting,
    isError: isQuoteError,
    error: quoteError,
  } = useDeliveryFeeQuote(isDelivery ? deliveryRegion : undefined, subtotal);

  const quoteErrorMessage =
    (quoteError as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
    t('market.deliveryFeeUnavailable');

  // Frais de livraison retenus pour l'affichage du total. En mode retrait : 0.
  // En livraison : le devis backend s'il a abouti, sinon on n'affiche pas de total ferme.
  const deliveryFee = isDelivery ? feeQuote?.delivery_fee ?? null : 0;
  const total = deliveryFee === null ? null : subtotal + deliveryFee;

  const canCheckout =
    items.length > 0 &&
    !isCheckingOut &&
    (!isDelivery || (Boolean(deliveryRegion) && !isQuoting && !isQuoteError && feeQuote != null));

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
            ...(isDelivery
              ? {
                  delivery_region: deliveryRegion,
                  delivery_address: deliveryAddress.trim() || undefined,
                }
              : {}),
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

  const etaLabel = feeQuote?.eta_days_min
    ? feeQuote.eta_days_max && feeQuote.eta_days_max !== feeQuote.eta_days_min
      ? t('market.deliveryEtaRange', { min: feeQuote.eta_days_min, max: feeQuote.eta_days_max })
      : t('market.deliveryEtaDays', { count: feeQuote.eta_days_min })
    : null;

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
                    <ProductImagePlaceholder category={item.category} iconSize={18} />
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
              onChange={(e) => setFulfillmentMode(e.target.value as OrderFulfillmentMode)}
            >
              <option value="retrait">{t('market.fulfillment.retrait')}</option>
              <option value="livraison">{t('market.fulfillment.livraison')}</option>
            </select>
          </div>

          {isDelivery && (
            <div className={styles.deliveryBlock}>
              <div className={styles.deliveryField}>
                <label className={styles.deliveryLabel} htmlFor="cart-delivery-region">
                  {t('market.deliveryRegion')}
                </label>
                <select
                  id="cart-delivery-region"
                  className={styles.fulfillmentSelect}
                  value={deliveryRegion}
                  onChange={(e) => setDeliveryRegion(e.target.value)}
                >
                  <option value="">{t('market.deliveryRegionPlaceholder')}</option>
                  {BURKINA_REGION_NAMES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.deliveryField}>
                <label className={styles.deliveryLabel} htmlFor="cart-delivery-address">
                  {t('market.deliveryAddress')}
                </label>
                <input
                  id="cart-delivery-address"
                  className={styles.deliveryInput}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={t('market.deliveryAddressPlaceholder')}
                />
              </div>
              {deliveryRegion && isQuoteError && <p className={styles.error}>{quoteErrorMessage}</p>}
            </div>
          )}

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>{t('market.cartSubtotal')}</span>
              <span>
                {subtotal.toLocaleString('fr-FR')} {currency}
              </span>
            </div>
            {isDelivery && (
              <div className={styles.summaryRow}>
                <span className={styles.deliveryLine}>
                  <Truck size={14} strokeWidth={2} />
                  {t('market.deliveryFee')}
                  {feeQuote?.delivery_provider && (
                    <span className={styles.provider}>· {feeQuote.delivery_provider}</span>
                  )}
                </span>
                <span>
                  {!deliveryRegion
                    ? t('market.deliveryFeePending')
                    : isQuoting
                      ? t('common.loading')
                      : isQuoteError
                        ? '—'
                        : feeQuote?.free_delivery_applied
                          ? t('market.deliveryFree')
                          : `${(feeQuote?.delivery_fee ?? 0).toLocaleString('fr-FR')} ${feeQuote?.currency ?? currency}`}
                </span>
              </div>
            )}
            {isDelivery && etaLabel && <p className={styles.eta}>{etaLabel}</p>}
            <div className={styles.totalRow}>
              <span>{t('market.cartTotal')}</span>
              <strong>
                {total === null ? '—' : `${total.toLocaleString('fr-FR')} ${currency}`}
              </strong>
            </div>
          </div>

          {checkoutError && <p className={styles.error}>{checkoutError}</p>}

          <div className={styles.actions}>
            <Button variant="secondary" onClick={clear} disabled={isCheckingOut}>
              {t('market.cartClear')}
            </Button>
            <Button fullWidth onClick={handleCheckout} disabled={!canCheckout}>
              {isCheckingOut ? t('common.loading') : t('market.cartCheckout')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

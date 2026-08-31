import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';

import { useCartTotalCount } from '../../../store/cart.store';
import { CartModal } from './CartModal';
import styles from './CartButton.module.css';

export function CartButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const count = useCartTotalCount();

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={t('market.cartTitle')}
      >
        <ShoppingCart size={19} strokeWidth={2} />
        {count > 0 && <span className={styles.badge}>{count > 9 ? '9+' : count}</span>}
      </button>

      <CartModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

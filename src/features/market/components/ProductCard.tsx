import { Link } from 'react-router-dom';
import { ImageOff, Star, ShoppingCart, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import { Card } from '../../../shared/ui';
import { useCartStore } from '../../../store/cart.store';
import { useToastStore } from '../../../store/toast.store';
import type { ProductSummary } from '../types';
import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: ProductSummary }) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const push = useToastStore((s) => s.push);
  const [justAdded, setJustAdded] = useState(false);
  const cover = product.photo;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      photo: product.photo,
      stock_quantity: product.stock_quantity,
      artisan_id: product.artisan_id,
    });
    push({ variant: 'success', message: t('market.addedToCart') });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Link to={`/market/${product.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.imageWrap}>
          {cover ? (
            <img src={cover} alt={product.name} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
          )}
          <span className={styles.categoryBadge}>{t(`market.categories.${product.category}`, product.category)}</span>
          {!product.in_stock && <span className={styles.outOfStockBadge}>{t('market.outOfStock')}</span>}
          {product.in_stock && (
            <button
              type="button"
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              aria-label={t('market.addToCart')}
            >
              {justAdded ? <Check size={16} strokeWidth={2.5} /> : <ShoppingCart size={16} strokeWidth={2} />}
            </button>
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.footer}>
            <span className={styles.price}>
              {product.price.toLocaleString('fr-FR')} {product.currency}
            </span>
            {product.average_rating > 0 && (
              <span className={styles.rating}>
                <Star size={13} strokeWidth={2} fill="currentColor" />
                {product.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

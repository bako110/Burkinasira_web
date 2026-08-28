import { Link } from 'react-router-dom';
import { ImageOff, Star, Truck, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card } from '../../../shared/ui';
import type { ProductSummary } from '../types';
import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: ProductSummary }) {
  const { t } = useTranslation();
  const cover = product.photo;
  const outOfStock = typeof product.stock_quantity === 'number' && product.stock_quantity <= 0;

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
          {outOfStock && <span className={styles.outOfStockBadge}>{t('market.outOfStock')}</span>}
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.footer}>
            <span className={styles.price}>
              {product.price.toLocaleString('fr-FR')} {product.currency}
            </span>
            {typeof product.average_rating === 'number' && product.average_rating > 0 && (
              <span className={styles.rating}>
                <Star size={13} strokeWidth={2} fill="currentColor" />
                {product.average_rating.toFixed(1)}
              </span>
            )}
          </div>
          {product.fulfillment_mode && (
            <span className={styles.fulfillment}>
              {product.fulfillment_mode === 'retrait' ? (
                <Package size={12} strokeWidth={2} />
              ) : (
                <Truck size={12} strokeWidth={2} />
              )}
              {t(`market.fulfillment.${product.fulfillment_mode}`)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

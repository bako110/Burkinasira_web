import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ShoppingBag } from 'lucide-react';

import { Button, Spinner, Modal, ConfirmDialog } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import type { ProductDetail } from '../../market/types';
import { useMyArtisanProfile, useMyProducts, useDeleteMyProduct } from '../hooks/useMyEstablishments';
import { EstablishmentListItem } from './EstablishmentListItem';
import { ArtisanProfileForm } from './ArtisanProfileForm';
import { ProductForm } from './ProductForm';
import { EstablishmentDetailPanel } from './EstablishmentDetailPanel';
import styles from './ArtisanMarketSection.module.css';

export function ArtisanMarketSection() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: artisanProfile, isLoading: isProfileLoading } = useMyArtisanProfile();
  const { data: products, isLoading: isProductsLoading } = useMyProducts();
  const deleteProduct = useDeleteMyProduct();

  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetail | undefined>(undefined);
  const [analyticsProduct, setAnalyticsProduct] = useState<ProductDetail | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<ProductDetail | undefined>(undefined);

  if (isProfileLoading) {
    return <Spinner size={22} />;
  }

  if (!artisanProfile) {
    return (
      <div className={styles.section}>
        <div className={styles.empty}>
          <ShoppingBag size={28} strokeWidth={1.5} />
          <p>{t('pro.artisanProfileRequired')}</p>
          <Button size="sm" onClick={() => setProfileFormOpen(true)}>
            <Plus size={16} strokeWidth={2} />
            {t('pro.addArtisanProfile')}
          </Button>
        </div>

        <Modal open={profileFormOpen} onClose={() => setProfileFormOpen(false)} title={t('pro.addArtisanProfile')}>
          <ArtisanProfileForm onSaved={() => setProfileFormOpen(false)} />
        </Modal>
      </div>
    );
  }

  if (analyticsProduct) {
    return (
      <EstablishmentDetailPanel
        itemType="product"
        itemId={analyticsProduct.id}
        name={analyticsProduct.name}
        status={analyticsProduct.status}
        onBack={() => setAnalyticsProduct(undefined)}
      />
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.profileCard}>
        <div>
          <h3 className={styles.headerTitle}>{artisanProfile.display_name}</h3>
          <span>{artisanProfile.city ?? artisanProfile.region}</span>
          {artisanProfile.review_count > 0 && (
            <span className={styles.profileRating}>
              ★ {artisanProfile.average_rating.toFixed(1)} ({artisanProfile.review_count})
            </span>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={() => setProfileFormOpen(true)}>
          {t('pro.editEstablishment')}
        </Button>
      </div>

      <div className={styles.headerRow}>
        <h3 className={styles.headerTitle}>{t('pro.myEstablishments')}</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingProduct(undefined);
            setFormOpen(true);
          }}
        >
          <Plus size={16} strokeWidth={2} />
          {t('pro.addProduct')}
        </Button>
      </div>

      {isProductsLoading ? (
        <Spinner size={22} />
      ) : !products || products.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingBag size={28} strokeWidth={1.5} />
          <p>{t('pro.noEstablishments')}</p>
          <span>{t('pro.noEstablishmentsDesc')}</span>
        </div>
      ) : (
        <div className={styles.list}>
          {products.map((product) => (
            <div key={product.id} className={styles.listItemWrap}>
              <EstablishmentListItem
                name={product.name}
                photo={product.photos[0]}
                typeLabel={t(`market.categories.${product.category}`, product.category)}
                meta={<span>{t('pro.stockQuantity')}: {product.stock_quantity ?? 0}</span>}
                priceLabel={`${product.price.toLocaleString('fr-FR')} ${product.currency}`}
                rating={product.average_rating}
                reviewCount={product.review_count}
                status={product.status}
                statusLabel={t(`pro.establishmentStatus_${product.status}`, product.status)}
                onViewAnalytics={() => setAnalyticsProduct(product)}
                onEdit={() => {
                  setEditingProduct(product);
                  setFormOpen(true);
                }}
                onDelete={() => setPendingDelete(product)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={profileFormOpen}
        onClose={() => setProfileFormOpen(false)}
        title={t('pro.editEstablishment')}
      >
        <ArtisanProfileForm profile={artisanProfile} onSaved={() => setProfileFormOpen(false)} />
      </Modal>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProduct ? t('pro.editEstablishment') : t('pro.addProduct')}
      >
        <ProductForm product={editingProduct} onSaved={() => setFormOpen(false)} onCancel={() => setFormOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('pro.deleteEstablishmentConfirmTitle')}
        message={t('pro.deleteEstablishmentConfirmMessage')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('pro.cancel')}
        variant="danger"
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteProduct.mutate(pendingDelete.id, {
            onSuccess: () => {
              push({ variant: 'success', message: t('pro.establishmentDeleted') });
              setPendingDelete(undefined);
            },
            onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
          });
        }}
      />
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageOff, ArrowLeft, Star, Truck, Package, User, Maximize2 } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, ImmersiveGallery } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { ContactModal } from '../../messaging/components/ContactModal';
import { useProductDetail } from '../hooks/useProductDetail';
import { useArtisanDetail } from '../hooks/useArtisanDetail';
import { ArtisanCard } from '../components/ArtisanCard';
import styles from './ProductDetailPage.module.css';

export function ProductDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [activePhoto, setActivePhoto] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const { data: product, isLoading, isError, refetch } = useProductDetail(id);
  const { data: artisan } = useArtisanDetail(product?.artisan_id);

  function handleContactArtisan() {
    requireAuth(() => setContactOpen(true), t('market.contactRequiresAuth'));
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('market.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/market')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.market')}
        </Button>
      </div>
    );
  }

  const outOfStock = typeof product.stock_quantity === 'number' && product.stock_quantity <= 0;
  const cover = product.photos[activePhoto] ?? product.photos[0];
  const allMedia = [...(product.photos ?? []), ...(product.videos ?? [])];

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/market" className={styles.backBtn}>
        {t('common.back')}
      </DetailBackButton>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImageWrap}>
            {cover ? (
              <button type="button" className={styles.mainImageButton} onClick={() => setGalleryOpen(true)}>
                <img src={cover} alt={product.name} className={styles.mainImage} />
                <span className={styles.expandHint}>
                  <Maximize2 size={16} strokeWidth={2} />
                </span>
              </button>
            ) : (
              <div className={styles.imagePlaceholder}>
                <ImageOff size={40} strokeWidth={1.5} />
              </div>
            )}
            {outOfStock && <span className={styles.outOfStockBadge}>{t('market.outOfStock')}</span>}
          </div>
          {product.photos.length > 1 && (
            <div className={styles.thumbRow}>
              {product.photos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.thumbBtn}
                  data-active={i === activePhoto}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={photo} alt="" className={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.categoryBadge}>{t(`market.categories.${product.category}`, product.category)}</span>
          <h1 className={styles.title}>{product.name}</h1>

          {typeof product.average_rating === 'number' && product.average_rating > 0 && (
            <span className={styles.rating}>
              <Star size={15} strokeWidth={2} fill="currentColor" />
              {product.average_rating.toFixed(1)}
              {typeof product.review_count === 'number' && product.review_count > 0 && (
                <span className={styles.reviewCount}>({product.review_count})</span>
              )}
            </span>
          )}

          <p className={styles.price}>
            {product.price.toLocaleString('fr-FR')} {product.currency}
          </p>

          {product.description && <p className={styles.description}>{product.description}</p>}

          {product.fulfillment_mode && (
            <span className={styles.fulfillment}>
              {product.fulfillment_mode === 'retrait' ? (
                <Package size={14} strokeWidth={2} />
              ) : (
                <Truck size={14} strokeWidth={2} />
              )}
              {t(`market.fulfillment.${product.fulfillment_mode}`)}
            </span>
          )}

          <Button fullWidth disabled={outOfStock} onClick={handleContactArtisan}>
            <User size={16} strokeWidth={2} />
            {outOfStock ? t('market.outOfStock') : t('market.contactArtisan')}
          </Button>

          {artisan && (
            <>
              <h2 className={styles.artisanSectionTitle}>{t('market.soldBy')}</h2>
              <ArtisanCard artisan={artisan} />
            </>
          )}
        </div>
      </div>

      <RelatedModules currentPath="/market" />

      {artisan && (
        <ContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          kind="touriste_artisan"
          otherUserId={artisan.user_id}
          recipientName={artisan.display_name}
          defaultMessage={t('market.contactDefaultMessage', { product: product.name })}
        />
      )}

      <ImmersiveGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        urls={allMedia}
        startIndex={activePhoto}
        title={product.name}
      />
    </div>
  );
}

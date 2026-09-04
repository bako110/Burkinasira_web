import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, Phone, ShieldCheck, ArrowLeft, Car, ExternalLink, Maximize2, MessageCircle } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, ImmersiveGallery } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { ReportErrorButton } from '../../dataQuality/components/ReportErrorButton';
import { ReviewsSection } from '../../reviews';
import { ContactModal } from '../../messaging/components/ContactModal';
import { useTransportProviderDetail } from '../hooks/useTransportProviderDetail';
import styles from './TransportDetailPage.module.css';

export function TransportDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);

  const { data: provider, isLoading, isError, refetch } = useTransportProviderDetail(id);

  function handleContact() {
    requireAuth(() => setContactOpen(true), t('mobility.contactRequiresAuth'));
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !provider) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('mobility.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/mobility')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.mobility')}
        </Button>
      </div>
    );
  }

  const location = [provider.city, provider.region].filter(Boolean).join(', ');
  const allMedia = [...(provider.photos ?? []), ...(provider.videos ?? [])];
  const mapsUrl = provider.base_location
    ? `https://www.google.com/maps?q=${provider.base_location.latitude},${provider.base_location.longitude}`
    : undefined;

  function openGallery(index: number) {
    setGalleryStartIndex(index);
    setGalleryOpen(true);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/mobility" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Car size={28} strokeWidth={1.5} />
          </span>
          <span className={styles.typeLabel}>{t(`mobility.types.${provider.type}`, provider.type)}</span>
          <h1 className={styles.title}>{provider.name}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {provider.review_count > 0 && (
              <span className={styles.metaItem}>
                <Star size={14} strokeWidth={2} fill="currentColor" />
                {provider.average_rating.toFixed(1)} ({provider.review_count})
              </span>
            )}
            {provider.is_verified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} strokeWidth={2} />
                {t('destinations.verified')}
              </span>
            )}
          </div>
          {allMedia.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => openGallery(0)}>
              <Maximize2 size={15} strokeWidth={2} />
              {t('gallery.ctaTransport')}
            </Button>
          )}
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          {provider.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{provider.description}</p>
            </section>
          )}

          {provider.vehicle_info && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('mobility.vehicleInfo')}</h2>
              <p className={styles.description}>{provider.vehicle_info}</p>
            </section>
          )}

          {allMedia.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('gallery.title')}</h2>
              <div className={styles.mediaGrid}>
                {allMedia.map((url, i) => (
                  <button key={i} type="button" className={styles.mediaThumbButton} onClick={() => openGallery(i)}>
                    {url.toLowerCase().split('?')[0].match(/\.(mp4|webm|mov)$/) ? (
                      <video src={url} muted className={styles.mediaThumb} />
                    ) : (
                      <img src={url} alt="" className={styles.mediaThumb} loading="lazy" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {typeof provider.price_estimate === 'number' && (
              <p className={styles.priceInfo}>
                {t('mobility.fromPrice', {
                  price: provider.price_estimate.toLocaleString('fr-FR'),
                  currency: provider.price_currency,
                })}
              </p>
            )}
            <div className={styles.contactList}>
              {provider.contact_phone && (
                <a href={`tel:${provider.contact_phone}`} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={2} />
                  <span>{provider.contact_phone}</span>
                </a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                  <ExternalLink size={15} strokeWidth={2} />
                  <span>{t('destinations.openInMaps')}</span>
                </a>
              )}
            </div>
            <Button fullWidth variant="secondary" onClick={handleContact}>
              <MessageCircle size={15} strokeWidth={2} />
              {t('mobility.contactProvider')}
            </Button>
          </div>
          <ReportErrorButton itemType="transport" itemId={provider.id} className={styles.reportBtn} />
        </aside>
      </div>

      <ReviewsSection targetType="transport" targetId={provider.id} />

      <RelatedModules currentPath="/mobility" />

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        kind="touriste_transport"
        otherUserId={provider.owner_id}
        recipientName={provider.name}
        defaultMessage={t('mobility.contactDefaultMessage', { name: provider.name })}
      />

      <ImmersiveGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        urls={allMedia}
        startIndex={galleryStartIndex}
        title={provider.name}
      />
    </div>
  );
}

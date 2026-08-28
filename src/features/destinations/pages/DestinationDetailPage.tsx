import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ImageOff,
  ArrowLeft,
  ExternalLink,
  Accessibility,
} from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BookingModal } from '../../bookings/components/BookingModal';
import { useDestinationDetail } from '../hooks/useDestinationDetail';
import styles from './DestinationDetailPage.module.css';

export function DestinationDetailPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: destination, isLoading, isError, refetch } = useDestinationDetail(slug);

  function handleBook() {
    if (!destination) return;
    requireAuth(() => setModalOpen(true), t('destinations.bookRequiresAuth'));
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !destination) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('destinations.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/explore')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.explore')}
        </Button>
      </div>
    );
  }

  const cover = destination.photos?.[0];
  const gallery = destination.photos?.slice(1, 5) ?? [];
  const location = [destination.city, destination.region].filter(Boolean).join(', ');
  const mapsUrl = destination.location
    ? `https://www.google.com/maps?q=${destination.location.latitude},${destination.location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        {cover ? (
          <img src={cover} alt={destination.name} className={styles.heroImg} />
        ) : (
          <div className={styles.heroPlaceholder}>
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/explore" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>
            {t(`categories.${destination.category}`, destination.category)}
          </span>
          <h1 className={styles.title}>{destination.name}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {typeof destination.average_rating === 'number' && destination.review_count ? (
              <span className={styles.metaItem}>
                <Star size={14} strokeWidth={2} fill="currentColor" />
                {destination.average_rating.toFixed(1)} ({destination.review_count})
              </span>
            ) : null}
            {destination.data_source?.verified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} strokeWidth={2} />
                {t('destinations.verified')}
              </span>
            )}
          </div>
        </div>
      </div>

      {gallery.length > 0 && (
        <div className={styles.gallery}>
          {gallery.map((photo, i) => (
            <img key={i} src={photo} alt="" className={styles.galleryImg} loading="lazy" />
          ))}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.main}>
          {destination.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{destination.description}</p>
            </section>
          )}

          {destination.history && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.history')}</h2>
              <p className={styles.description}>{destination.history}</p>
            </section>
          )}

          {destination.services_on_site && destination.services_on_site.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.services')}</h2>
              <div className={styles.tagList}>
                {destination.services_on_site.map((service) => (
                  <span key={service} className={styles.tag}>
                    {service}
                  </span>
                ))}
              </div>
            </section>
          )}

          {destination.opening_hours && destination.opening_hours.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.openingHours')}</h2>
              <div className={styles.hoursList}>
                {destination.opening_hours.map((h) => (
                  <div key={h.day} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>{h.day}</span>
                    <span className={styles.hoursTime}>
                      {h.closed ? t('destinations.closed') : `${h.open_time ?? '—'} – ${h.close_time ?? '—'}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {destination.accessibility?.wheelchair_accessible !== null &&
            destination.accessibility?.wheelchair_accessible !== undefined && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('destinations.accessibility')}</h2>
                <p className={styles.accessibilityRow}>
                  <Accessibility size={16} strokeWidth={2} />
                  {destination.accessibility.wheelchair_accessible
                    ? t('destinations.wheelchairYes')
                    : t('destinations.wheelchairNo')}
                </p>
                {destination.accessibility.notes && (
                  <p className={styles.description}>{destination.accessibility.notes}</p>
                )}
              </section>
            )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {destination.price_info && <p className={styles.priceInfo}>{destination.price_info}</p>}

            <Button fullWidth onClick={handleBook}>
              {t('destinations.planVisit')}
            </Button>

            <div className={styles.contactList}>
              {destination.address && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{destination.address}</span>
                </div>
              )}
              {destination.contact_phone && (
                <a href={`tel:${destination.contact_phone}`} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={2} />
                  <span>{destination.contact_phone}</span>
                </a>
              )}
              {destination.contact_email && (
                <a href={`mailto:${destination.contact_email}`} className={styles.contactRow}>
                  <Mail size={15} strokeWidth={2} />
                  <span>{destination.contact_email}</span>
                </a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                  <ExternalLink size={15} strokeWidth={2} />
                  <span>{t('destinations.openInMaps')}</span>
                </a>
              )}
              {destination.booking_url && (
                <a href={destination.booking_url} target="_blank" rel="noreferrer" className={styles.contactRow}>
                  <Clock size={15} strokeWidth={2} />
                  <span>{t('destinations.externalBooking')}</span>
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>

      <RelatedModules currentPath="/explore" />

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        itemType="visit"
        itemId={destination.id}
        itemTitle={destination.name}
        unitPrice={0}
        requiresDate
      />
    </div>
  );
}

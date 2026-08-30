import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, Phone, Mail, ShieldCheck, ImageOff, ArrowLeft, ExternalLink, Utensils, RotateCw } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Virtual360Viewer } from '../../../shared/ui';
import { useRestaurantDetail } from '../hooks/useRestaurantDetail';
import styles from './RestaurantDetailPage.module.css';

export function RestaurantDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tourOpen, setTourOpen] = useState(false);

  const { data: restaurant, isLoading, isError, refetch } = useRestaurantDetail(id);

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('restaurants.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/restaurants')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.restaurants')}
        </Button>
      </div>
    );
  }

  const cover = restaurant.photos?.[0];
  const gallery = restaurant.photos?.slice(1, 5) ?? [];
  const location = [restaurant.city, restaurant.region].filter(Boolean).join(', ');
  const mapsUrl = restaurant.location
    ? `https://www.google.com/maps?q=${restaurant.location.latitude},${restaurant.location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        {cover ? (
          <img src={cover} alt={restaurant.name} className={styles.heroImg} />
        ) : (
          <div className={styles.heroPlaceholder}>
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/restaurants" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`restaurants.types.${restaurant.type}`, restaurant.type)}</span>
          <h1 className={styles.title}>{restaurant.name}</h1>
          <div className={styles.heroMeta}>
            {restaurant.cuisine_style && <span className={styles.metaItem}>{restaurant.cuisine_style}</span>}
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {restaurant.review_count > 0 && (
              <span className={styles.metaItem}>
                <Star size={14} strokeWidth={2} fill="currentColor" />
                {restaurant.average_rating.toFixed(1)} ({restaurant.review_count})
              </span>
            )}
            {restaurant.is_verified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} strokeWidth={2} />
                {t('destinations.verified')}
              </span>
            )}
          </div>
          {restaurant.photos_360.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => setTourOpen(true)}>
              <RotateCw size={15} strokeWidth={2} />
              {t('virtualTour.ctaRestaurant')}
            </Button>
          )}
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
          {restaurant.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{restaurant.description}</p>
            </section>
          )}

          {restaurant.dietary_tags.length > 0 && (
            <section className={styles.section}>
              <div className={styles.tagList}>
                {restaurant.dietary_tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {t(`restaurants.dietaryTags.${tag}`, tag)}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('destinations.services')}</h2>
            <div className={styles.serviceList}>
              {restaurant.accepts_table_booking && (
                <span className={styles.serviceTag}>{t('restaurants.tableBooking')}</span>
              )}
              {restaurant.offers_takeaway && <span className={styles.serviceTag}>{t('restaurants.takeaway')}</span>}
              {restaurant.offers_cooking_workshop && (
                <span className={styles.serviceTag}>{t('restaurants.cookingWorkshop')}</span>
              )}
            </div>
          </section>

          {restaurant.menu.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Utensils size={18} strokeWidth={2} />
                {t('restaurants.menu')}
              </h2>
              <div className={styles.menuList}>
                {restaurant.menu.map((item, i) => (
                  <div key={i} className={styles.menuRow}>
                    <div className={styles.menuInfo}>
                      <p className={styles.menuName}>
                        {item.name}
                        {item.is_specialty && <span className={styles.specialtyBadge}>{t('restaurants.specialty')}</span>}
                      </p>
                      {item.description && <p className={styles.menuDescription}>{item.description}</p>}
                    </div>
                    {typeof item.price === 'number' && (
                      <span className={styles.menuPrice}>
                        {item.price.toLocaleString('fr-FR')} {item.currency}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {restaurant.opening_hours.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.openingHours')}</h2>
              <div className={styles.hoursList}>
                {restaurant.opening_hours.map((h) => (
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
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <div className={styles.contactList}>
              {restaurant.address && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.contact_phone && (
                <a href={`tel:${restaurant.contact_phone}`} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={2} />
                  <span>{restaurant.contact_phone}</span>
                </a>
              )}
              {restaurant.contact_email && (
                <a href={`mailto:${restaurant.contact_email}`} className={styles.contactRow}>
                  <Mail size={15} strokeWidth={2} />
                  <span>{restaurant.contact_email}</span>
                </a>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                  <ExternalLink size={15} strokeWidth={2} />
                  <span>{t('destinations.openInMaps')}</span>
                </a>
              )}
            </div>
          </div>
        </aside>
      </div>

      <RelatedModules currentPath="/restaurants" />

      <Virtual360Viewer
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        urls={restaurant.photos_360}
        title={t('virtualTour.ctaRestaurant')}
      />
    </div>
  );
}

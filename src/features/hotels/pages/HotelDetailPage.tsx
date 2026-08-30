import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Star, Phone, Mail, ShieldCheck, ImageOff, ArrowLeft, ExternalLink, Tag, RotateCw } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules, Virtual360Viewer } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BookingModal } from '../../bookings/components/BookingModal';
import { useHotelDetail } from '../hooks/useHotelDetail';
import type { RoomType } from '../types';
import styles from './HotelDetailPage.module.css';

export function HotelDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [tourOpen, setTourOpen] = useState(false);

  const { data: hotel, isLoading, isError, refetch } = useHotelDetail(id);

  function handleBookRoom(room: RoomType) {
    setSelectedRoom(room);
    requireAuth(() => setModalOpen(true), t('hotels.bookRequiresAuth'));
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !hotel) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('hotels.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/hotels')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.hotels')}
        </Button>
      </div>
    );
  }

  const cover = hotel.photos?.[0];
  const gallery = hotel.photos?.slice(1, 5) ?? [];
  const location = [hotel.city, hotel.region].filter(Boolean).join(', ');
  const mapsUrl = hotel.location
    ? `https://www.google.com/maps?q=${hotel.location.latitude},${hotel.location.longitude}`
    : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        {cover ? (
          <img src={cover} alt={hotel.name} className={styles.heroImg} />
        ) : (
          <div className={styles.heroPlaceholder}>
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/hotels" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`hotels.types.${hotel.type}`, hotel.type)}</span>
          <h1 className={styles.title}>{hotel.name}</h1>
          <div className={styles.heroMeta}>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
              </span>
            )}
            {hotel.review_count > 0 && (
              <span className={styles.metaItem}>
                <Star size={14} strokeWidth={2} fill="currentColor" />
                {hotel.average_rating.toFixed(1)} ({hotel.review_count})
              </span>
            )}
            {hotel.is_verified && (
              <span className={styles.verifiedBadge}>
                <ShieldCheck size={14} strokeWidth={2} />
                {t('destinations.verified')}
              </span>
            )}
          </div>
          {hotel.photos_360.length > 0 && (
            <Button variant="secondary" size="sm" onClick={() => setTourOpen(true)}>
              <RotateCw size={15} strokeWidth={2} />
              {t('virtualTour.ctaHotel')}
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
          {hotel.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{hotel.description}</p>
            </section>
          )}

          {hotel.amenities.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('hotels.amenities')}</h2>
              <div className={styles.tagList}>
                {hotel.amenities.map((amenity) => (
                  <span key={amenity} className={styles.tag}>
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {hotel.room_types.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('hotels.roomTypes')}</h2>
              <div className={styles.roomList}>
                {hotel.room_types.map((room, i) => (
                  <div key={i} className={styles.roomCard}>
                    <div className={styles.roomInfo}>
                      <h3 className={styles.roomName}>{room.name}</h3>
                      <p className={styles.roomMeta}>
                        {t('hotels.capacity', { count: room.capacity })} · {room.total_rooms}{' '}
                        {t('hotels.roomsAvailable')}
                      </p>
                      {room.amenities.length > 0 && (
                        <div className={styles.tagList}>
                          {room.amenities.map((a) => (
                            <span key={a} className={styles.tagSmall}>
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={styles.roomAction}>
                      <span className={styles.roomPrice}>
                        {room.price_per_night.toLocaleString('fr-FR')} {room.currency}
                        <span className={styles.roomPriceUnit}>/{t('hotels.night')}</span>
                      </span>
                      <Button size="sm" onClick={() => handleBookRoom(room)}>
                        {t('hotels.book')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hotel.offers.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('hotels.offers')}</h2>
              <div className={styles.offerList}>
                {hotel.offers.map((offer, i) => (
                  <div key={i} className={styles.offerCard}>
                    <Tag size={16} strokeWidth={2} className={styles.offerIcon} />
                    <div>
                      <p className={styles.offerTitle}>
                        {offer.title}
                        {typeof offer.discount_percent === 'number' && (
                          <span className={styles.offerDiscount}> −{offer.discount_percent}%</span>
                        )}
                      </p>
                      {offer.description && <p className={styles.offerDescription}>{offer.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            <div className={styles.contactList}>
              {hotel.address && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{hotel.address}</span>
                </div>
              )}
              {hotel.contact_phone && (
                <a href={`tel:${hotel.contact_phone}`} className={styles.contactRow}>
                  <Phone size={15} strokeWidth={2} />
                  <span>{hotel.contact_phone}</span>
                </a>
              )}
              {hotel.contact_email && (
                <a href={`mailto:${hotel.contact_email}`} className={styles.contactRow}>
                  <Mail size={15} strokeWidth={2} />
                  <span>{hotel.contact_email}</span>
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

      <RelatedModules currentPath="/hotels" />

      {selectedRoom && (
        <BookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          itemType="hotel"
          itemId={hotel.id}
          itemTitle={`${hotel.name} — ${selectedRoom.name}`}
          unitPrice={selectedRoom.price_per_night}
          currency={selectedRoom.currency}
          requiresDate
        />
      )}

      <Virtual360Viewer
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        urls={hotel.photos_360}
        title={t('virtualTour.ctaHotel')}
      />
    </div>
  );
}

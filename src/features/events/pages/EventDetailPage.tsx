import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Calendar, ImageOff, ArrowLeft, ExternalLink, Ticket, Clock } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, RelatedModules } from '../../../shared/ui';
import { ReportErrorButton } from '../../dataQuality/components/ReportErrorButton';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BookingModal } from '../../bookings/components/BookingModal';
import { useEventDetail } from '../hooks/useEventDetail';
import { useLinkedHotels } from '../hooks/useLinkedHotels';
import { useLinkedTransportProviders } from '../hooks/useLinkedTransportProviders';
import { LinkedItemCard } from '../components/LinkedItemCard';
import styles from './EventDetailPage.module.css';

export function EventDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: event, isLoading, isError, refetch } = useEventDetail(id);
  const linkedHotels = useLinkedHotels(event?.linked_hotel_ids);
  const linkedTransportProviders = useLinkedTransportProviders(event?.linked_transport_provider_ids);
  const canBook = typeof event?.ticket_price === 'number';

  function handleGetTicket() {
    requireAuth(() => setModalOpen(true), t('events.ticketRequiresAuth'));
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('events.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/events')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.events')}
        </Button>
      </div>
    );
  }

  const cover = event.photos?.[0];
  const gallery = event.photos?.slice(1, 5) ?? [];
  const location = [event.city, event.region].filter(Boolean).join(', ');
  const mapsUrl = event.location
    ? `https://www.google.com/maps?q=${event.location.latitude},${event.location.longitude}`
    : undefined;
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.heroImage}>
        {cover ? (
          <img src={cover} alt={event.title} className={styles.heroImg} />
        ) : (
          <div className={styles.heroPlaceholder}>
            <ImageOff size={40} strokeWidth={1.5} />
          </div>
        )}
        <div className={styles.heroOverlay} />
        <DetailBackButton fallbackTo="/events" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.categoryBadge}>{t(`events.categories.${event.category}`, event.category)}</span>
          <h1 className={styles.title}>{event.title}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>
              <Calendar size={14} strokeWidth={2} />
              {startDate.toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' })}
              {endDate && ` – ${endDate.toLocaleDateString(i18n.language, { day: '2-digit', month: 'long' })}`}
            </span>
            {location && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {location}
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
          {event.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('destinations.about')}</h2>
              <p className={styles.description}>{event.description}</p>
            </section>
          )}

          {event.program.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Clock size={18} strokeWidth={2} />
                {t('events.program')}
              </h2>
              <div className={styles.programList}>
                {event.program.map((item, i) => (
                  <div key={i} className={styles.programRow}>
                    {item.time && <span className={styles.programTime}>{item.time}</span>}
                    <div>
                      <p className={styles.programTitle}>{item.title}</p>
                      {item.description && <p className={styles.programDescription}>{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {linkedHotels.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('events.linkedHotels')}</h2>
              <div className={styles.linkedGrid}>
                {linkedHotels.map((hotel) => (
                  <LinkedItemCard
                    key={hotel.id}
                    to={`/hotels/${hotel.slug}`}
                    name={hotel.name}
                    location={[hotel.city, hotel.region].filter(Boolean).join(', ')}
                    rating={hotel.average_rating}
                    reviewCount={hotel.review_count}
                  />
                ))}
              </div>
            </section>
          )}

          {linkedTransportProviders.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{t('events.linkedTransport')}</h2>
              <div className={styles.linkedGrid}>
                {linkedTransportProviders.map((provider) => (
                  <LinkedItemCard
                    key={provider.id}
                    to={`/mobility/${provider.slug}`}
                    name={provider.name}
                    location={[provider.city, provider.region].filter(Boolean).join(', ')}
                    price={provider.price_estimate}
                    currency={provider.price_currency}
                    rating={provider.average_rating}
                    reviewCount={provider.review_count}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoCard}>
            {event.requires_ticket && (
              <p className={styles.priceInfo}>
                <Ticket size={16} strokeWidth={2} />
                {typeof event.ticket_price === 'number'
                  ? t('events.ticketPrice', {
                      price: event.ticket_price.toLocaleString('fr-FR'),
                      currency: event.currency,
                    })
                  : t('events.ticketRequired')}
              </p>
            )}
            {event.requires_ticket && (
              <Button fullWidth onClick={handleGetTicket} disabled={!canBook}>
                {canBook ? t('events.getTicket') : t('events.priceUnavailable')}
              </Button>
            )}
            <div className={styles.contactList}>
              {event.address && (
                <div className={styles.contactRow}>
                  <MapPin size={15} strokeWidth={2} />
                  <span>{event.address}</span>
                </div>
              )}
              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.contactRow}>
                  <ExternalLink size={15} strokeWidth={2} />
                  <span>{t('destinations.openInMaps')}</span>
                </a>
              )}
            </div>
          </div>
          <ReportErrorButton itemType="event" itemId={event.id} className={styles.reportBtn} />
        </aside>
      </div>

      <RelatedModules currentPath="/events" />

      {canBook && (
        <BookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          itemType="event"
          itemId={event.id}
          itemTitle={event.title}
          unitPrice={event.ticket_price!}
          currency={event.currency}
        />
      )}
    </div>
  );
}

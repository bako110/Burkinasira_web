import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ImageOff, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Card, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { BookingModal } from '../../bookings/components/BookingModal';
import type { EventSummary } from '../types';
import styles from './EventCard.module.css';

export function EventCard({ event }: { event: EventSummary }) {
  const { t, i18n } = useTranslation();
  const requireAuth = useRequireAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const location = [event.city, event.region].filter(Boolean).join(', ');
  const startDate = new Date(event.start_date);
  const day = startDate.toLocaleDateString(i18n.language, { day: '2-digit' });
  const month = startDate.toLocaleDateString(i18n.language, { month: 'short' });
  const canBook = typeof event.ticket_price === 'number';

  function handleGetTicket() {
    requireAuth(() => setModalOpen(true), t('events.ticketRequiresAuth'));
  }

  return (
    <Card className={styles.card}>
      <Link to={`/events/${event.id}`} className={styles.link}>
        <div className={styles.imageWrap}>
          {event.photo ? (
            <img src={event.photo} alt={event.title} className={styles.image} loading="lazy" />
          ) : (
            <div className={styles.imagePlaceholder}>
              <ImageOff size={22} strokeWidth={1.5} />
            </div>
          )}
          <div className={styles.dateBadge}>
            <span className={styles.dateDay}>{day}</span>
            <span className={styles.dateMonth}>{month}</span>
          </div>
          <span className={styles.categoryBadge}>{t(`events.categories.${event.category}`, event.category)}</span>
        </div>
        <div className={styles.body}>
          <h3 className={styles.name}>{event.title}</h3>
          {location && (
            <p className={styles.location}>
              <MapPin size={13} strokeWidth={2} />
              {location}
            </p>
          )}
          {event.requires_ticket && (
            <span className={styles.ticket}>
              <Ticket size={13} strokeWidth={2} />
              {typeof event.ticket_price === 'number'
                ? t('events.ticketPrice', { price: event.ticket_price.toLocaleString('fr-FR'), currency: event.currency })
                : t('events.ticketRequired')}
            </span>
          )}
        </div>
      </Link>

      {event.requires_ticket && (
        <div className={styles.actionRow}>
          <Button variant="secondary" size="sm" fullWidth onClick={handleGetTicket} disabled={!canBook}>
            {canBook ? t('events.getTicket') : t('events.priceUnavailable')}
          </Button>
        </div>
      )}

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
    </Card>
  );
}

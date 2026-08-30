import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Building } from 'lucide-react';

import { Button, Spinner, Modal, ConfirmDialog } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import type { HotelDetail } from '../../hotels/types';
import { useMyHotels, useDeleteMyHotel } from '../hooks/useMyEstablishments';
import { EstablishmentListItem } from './EstablishmentListItem';
import { HotelForm } from './HotelForm';
import { EstablishmentDetailPanel } from './EstablishmentDetailPanel';
import styles from './HotelSection.module.css';

export function HotelSection() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: hotels, isLoading } = useMyHotels();
  const deleteHotel = useDeleteMyHotel();

  const [formOpen, setFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelDetail | undefined>(undefined);
  const [analyticsHotel, setAnalyticsHotel] = useState<HotelDetail | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<HotelDetail | undefined>(undefined);

  if (isLoading) {
    return <Spinner size={22} />;
  }

  if (analyticsHotel) {
    return (
      <EstablishmentDetailPanel
        itemType="hotel"
        itemId={analyticsHotel.id}
        name={analyticsHotel.name}
        status={analyticsHotel.status}
        onBack={() => setAnalyticsHotel(undefined)}
      />
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.headerRow}>
        <h3 className={styles.headerTitle}>{t('pro.myEstablishments')}</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingHotel(undefined);
            setFormOpen(true);
          }}
        >
          <Plus size={16} strokeWidth={2} />
          {t('pro.addHotel')}
        </Button>
      </div>

      {!hotels || hotels.length === 0 ? (
        <div className={styles.empty}>
          <Building size={28} strokeWidth={1.5} />
          <p>{t('pro.noEstablishments')}</p>
          <span>{t('pro.noEstablishmentsDesc')}</span>
        </div>
      ) : (
        <div className={styles.list}>
          {hotels.map((hotel) => {
            const prices = hotel.room_types.map((rt) => rt.price_per_night);
            const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
            const currency = hotel.room_types[0]?.currency ?? 'XOF';

            return (
              <div key={hotel.id} className={styles.listItemWrap}>
                <EstablishmentListItem
                  name={hotel.name}
                  photo={hotel.photos[0]}
                  typeLabel={t(`hotels.types.${hotel.type}`, hotel.type)}
                  meta={<span>{hotel.city ?? hotel.region}</span>}
                  priceLabel={minPrice !== undefined ? `${minPrice.toLocaleString('fr-FR')} ${currency}` : undefined}
                  rating={hotel.average_rating}
                  reviewCount={hotel.review_count}
                  status={hotel.status}
                  statusLabel={t(`pro.establishmentStatus_${hotel.status}`, hotel.status)}
                  onViewAnalytics={() => setAnalyticsHotel(hotel)}
                  onEdit={() => {
                    setEditingHotel(hotel);
                    setFormOpen(true);
                  }}
                  onDelete={() => setPendingDelete(hotel)}
                />
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingHotel ? t('pro.editEstablishment') : t('pro.addHotel')}
      >
        <HotelForm hotel={editingHotel} onSaved={() => setFormOpen(false)} onCancel={() => setFormOpen(false)} />
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
          deleteHotel.mutate(pendingDelete.id, {
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

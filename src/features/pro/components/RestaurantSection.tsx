import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Building } from 'lucide-react';

import { Button, Spinner, Modal, ConfirmDialog } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import type { RestaurantDetail } from '../../restaurants/types';
import { useMyRestaurants, useDeleteMyRestaurant } from '../hooks/useMyEstablishments';
import { EstablishmentListItem } from './EstablishmentListItem';
import { RestaurantForm } from './RestaurantForm';
import { EstablishmentDetailPanel } from './EstablishmentDetailPanel';
import styles from './RestaurantSection.module.css';

export function RestaurantSection() {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: restaurants, isLoading } = useMyRestaurants();
  const deleteRestaurant = useDeleteMyRestaurant();

  const [formOpen, setFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantDetail | undefined>(undefined);
  const [analyticsRestaurant, setAnalyticsRestaurant] = useState<RestaurantDetail | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<RestaurantDetail | undefined>(undefined);

  if (isLoading) {
    return <Spinner size={22} />;
  }

  if (analyticsRestaurant) {
    return (
      <EstablishmentDetailPanel
        itemType="restaurant"
        itemId={analyticsRestaurant.id}
        name={analyticsRestaurant.name}
        status={analyticsRestaurant.status}
        onBack={() => setAnalyticsRestaurant(undefined)}
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
            setEditingRestaurant(undefined);
            setFormOpen(true);
          }}
        >
          <Plus size={16} strokeWidth={2} />
          {t('pro.addRestaurant')}
        </Button>
      </div>

      {!restaurants || restaurants.length === 0 ? (
        <div className={styles.empty}>
          <Building size={28} strokeWidth={1.5} />
          <p>{t('pro.noEstablishments')}</p>
          <span>{t('pro.noEstablishmentsDesc')}</span>
        </div>
      ) : (
        <div className={styles.list}>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className={styles.listItemWrap}>
              <EstablishmentListItem
                name={restaurant.name}
                photo={restaurant.photos[0]}
                typeLabel={t(`restaurants.types.${restaurant.type}`, restaurant.type)}
                meta={
                  <>
                    <span>{restaurant.city ?? restaurant.region}</span>
                    {restaurant.cuisine_style && <span>{restaurant.cuisine_style}</span>}
                  </>
                }
                rating={restaurant.average_rating}
                reviewCount={restaurant.review_count}
                status={restaurant.status}
                statusLabel={t(`pro.establishmentStatus_${restaurant.status}`, restaurant.status)}
                onViewAnalytics={() => setAnalyticsRestaurant(restaurant)}
                onEdit={() => {
                  setEditingRestaurant(restaurant);
                  setFormOpen(true);
                }}
                onDelete={() => setPendingDelete(restaurant)}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingRestaurant ? t('pro.editEstablishment') : t('pro.addRestaurant')}
      >
        <RestaurantForm
          restaurant={editingRestaurant}
          onSaved={() => setFormOpen(false)}
          onCancel={() => setFormOpen(false)}
        />
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
          deleteRestaurant.mutate(pendingDelete.id, {
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

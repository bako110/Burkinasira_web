import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, UtensilsCrossed, Car, ShoppingBag, Plus } from 'lucide-react';

import { Spinner } from '../../../shared/ui';
import {
  useMyHotels,
  useMyRestaurants,
  useMyTransportProviders,
  useMyProducts,
  useMyArtisanProfile,
} from '../hooks/useMyEstablishments';
import { StatTile } from './StatTile';
import styles from './OverviewTab.module.css';

interface OverviewTabProps {
  onNavigate: (tabKey: string) => void;
}

const CATEGORY_ICONS = { hotel: Building2, restaurant: UtensilsCrossed, transport: Car, artisan: ShoppingBag };

export function OverviewTab({ onNavigate }: OverviewTabProps) {
  const { t } = useTranslation();
  const { data: hotels, isLoading: loadingHotels } = useMyHotels();
  const { data: restaurants, isLoading: loadingRestaurants } = useMyRestaurants();
  const { data: transportProviders, isLoading: loadingTransport } = useMyTransportProviders();
  const { data: artisanProfile, isLoading: loadingArtisanProfile } = useMyArtisanProfile();
  const { data: products, isLoading: loadingProducts } = useMyProducts();
  const [showAddMore, setShowAddMore] = useState(false);
  const isLoading =
    loadingHotels || loadingRestaurants || loadingTransport || loadingArtisanProfile || loadingProducts;

  if (isLoading) {
    return <Spinner size={22} />;
  }

  const ratedItems = [
    ...(hotels ?? []),
    ...(restaurants ?? []),
    ...(transportProviders ?? []),
    ...(products ?? []),
  ].filter((item) => (item.review_count ?? 0) > 0);

  const totalEstablishments =
    (hotels?.length ?? 0) + (restaurants?.length ?? 0) + (transportProviders?.length ?? 0) + (products?.length ?? 0);

  const averageRating =
    ratedItems.length > 0
      ? ratedItems.reduce((sum, item) => sum + (item.average_rating ?? 0), 0) / ratedItems.length
      : 0;

  const UNPUBLISHED_STATUSES = new Set(['draft', 'pending']);
  const pendingCount = [
    ...(hotels ?? []),
    ...(restaurants ?? []),
    ...(transportProviders ?? []),
  ].filter((item) => UNPUBLISHED_STATUSES.has(item.status)).length;

  const allCategories = [
    { key: 'hotel', label: t('pro.tab_hotel'), count: hotels?.length ?? 0, owned: (hotels?.length ?? 0) > 0 },
    {
      key: 'restaurant',
      label: t('pro.tab_restaurant'),
      count: restaurants?.length ?? 0,
      owned: (restaurants?.length ?? 0) > 0,
    },
    {
      key: 'transport',
      label: t('pro.tab_transport'),
      count: transportProviders?.length ?? 0,
      owned: (transportProviders?.length ?? 0) > 0,
    },
    { key: 'artisan', label: t('pro.tab_artisan'), count: products?.length ?? 0, owned: Boolean(artisanProfile) },
  ] as const;

  const ownedCategories = allCategories.filter((c) => c.owned);
  const otherCategories = allCategories.filter((c) => !c.owned);

  return (
    <div className={styles.container}>
      <div className={styles.statGrid}>
        <StatTile label={t('pro.statTotalEstablishments')} value={String(totalEstablishments)} />
        <StatTile label={t('pro.statAverageRating')} value={averageRating > 0 ? averageRating.toFixed(1) : '—'} />
        {pendingCount > 0 && (
          <StatTile label={t('pro.establishmentStatus_pending')} value={String(pendingCount)} />
        )}
      </div>

      <div className={styles.categoryGrid}>
        {ownedCategories.map(({ key, label, count }) => {
          const Icon = CATEGORY_ICONS[key];
          return (
            <button key={key} type="button" className={styles.categoryCard} onClick={() => onNavigate(key)}>
              <span className={styles.categoryIcon}>
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <span className={styles.categoryLabel}>{label}</span>
              <span className={styles.categoryCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {otherCategories.length > 0 && (
        <div className={styles.addMoreSection}>
          {!showAddMore ? (
            <button type="button" className={styles.addMoreToggle} onClick={() => setShowAddMore(true)}>
              <Plus size={15} strokeWidth={2} />
              {t('pro.addAnotherType')}
            </button>
          ) : (
            <div className={styles.categoryGrid}>
              {otherCategories.map(({ key, label }) => {
                const Icon = CATEGORY_ICONS[key];
                return (
                  <button key={key} type="button" className={styles.categoryCardMuted} onClick={() => onNavigate(key)}>
                    <span className={styles.categoryIcon}>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <span className={styles.categoryLabel}>{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

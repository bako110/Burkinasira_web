import { useTranslation } from 'react-i18next';
import { Building2, UtensilsCrossed, Car, ShoppingBag, HeartPulse } from 'lucide-react';

import { Spinner, Reveal } from '../../../shared/ui';
import {
  useMyHotels,
  useMyRestaurants,
  useMyTransportProviders,
  useMyProducts,
  useMyArtisanProfile,
  useMyHealthFacilities,
} from '../hooks/useMyEstablishments';
import { StatTile } from './StatTile';
import styles from './OverviewTab.module.css';

interface OverviewTabProps {
  onNavigate: (tabKey: string) => void;
}

const CATEGORY_ICONS = {
  hotel: Building2,
  restaurant: UtensilsCrossed,
  transport: Car,
  artisan: ShoppingBag,
  health: HeartPulse,
};

export function OverviewTab({ onNavigate }: OverviewTabProps) {
  const { t } = useTranslation();
  const { data: hotels, isLoading: loadingHotels } = useMyHotels();
  const { data: restaurants, isLoading: loadingRestaurants } = useMyRestaurants();
  const { data: transportProviders, isLoading: loadingTransport } = useMyTransportProviders();
  const { data: artisanProfile, isLoading: loadingArtisanProfile } = useMyArtisanProfile();
  const { data: products, isLoading: loadingProducts } = useMyProducts();
  const { data: healthFacilities, isLoading: loadingHealth } = useMyHealthFacilities();
  const isLoading =
    loadingHotels ||
    loadingRestaurants ||
    loadingTransport ||
    loadingArtisanProfile ||
    loadingProducts ||
    loadingHealth;

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
    (hotels?.length ?? 0) +
    (restaurants?.length ?? 0) +
    (transportProviders?.length ?? 0) +
    (products?.length ?? 0) +
    (healthFacilities?.length ?? 0);

  const averageRating =
    ratedItems.length > 0
      ? ratedItems.reduce((sum, item) => sum + (item.average_rating ?? 0), 0) / ratedItems.length
      : 0;

  const UNPUBLISHED_STATUSES = new Set(['draft', 'pending']);
  const pendingCount = [
    ...(hotels ?? []),
    ...(restaurants ?? []),
    ...(transportProviders ?? []),
    ...(healthFacilities ?? []),
  ].filter((item) => UNPUBLISHED_STATUSES.has(item.status ?? '')).length;

  const ownedCategories = [
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
    {
      key: 'health',
      label: t('pro.tab_health'),
      count: healthFacilities?.length ?? 0,
      owned: (healthFacilities?.length ?? 0) > 0,
    },
  ].filter((c) => c.owned);

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
        {ownedCategories.map(({ key, label, count }, i) => {
          const Icon = CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS];
          return (
            <Reveal key={key} delay={Math.min(i, 8) * 50}>
              <button type="button" className={styles.categoryCard} onClick={() => onNavigate(key)}>
                <span className={styles.categoryIcon}>
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <span className={styles.categoryLabel}>{label}</span>
                <span className={styles.categoryCount}>{count}</span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

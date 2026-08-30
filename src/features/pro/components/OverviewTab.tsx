import { useTranslation } from 'react-i18next';
import { Building2, UtensilsCrossed, Car, ShoppingBag } from 'lucide-react';

import { Spinner } from '../../../shared/ui';
import {
  useMyHotels,
  useMyRestaurants,
  useMyTransportProviders,
  useMyProducts,
} from '../hooks/useMyEstablishments';
import { StatTile } from './StatTile';
import styles from './OverviewTab.module.css';

interface OverviewTabProps {
  onNavigate: (tabKey: string) => void;
}

export function OverviewTab({ onNavigate }: OverviewTabProps) {
  const { t } = useTranslation();
  const { data: hotels, isLoading: loadingHotels } = useMyHotels();
  const { data: restaurants, isLoading: loadingRestaurants } = useMyRestaurants();
  const { data: transportProviders, isLoading: loadingTransport } = useMyTransportProviders();
  const { data: products, isLoading: loadingProducts } = useMyProducts();

  const isLoading = loadingHotels || loadingRestaurants || loadingTransport || loadingProducts;

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

  const categories = [
    { key: 'hotel', label: t('pro.tab_hotel'), Icon: Building2, count: hotels?.length ?? 0 },
    { key: 'restaurant', label: t('pro.tab_restaurant'), Icon: UtensilsCrossed, count: restaurants?.length ?? 0 },
    { key: 'transport', label: t('pro.tab_transport'), Icon: Car, count: transportProviders?.length ?? 0 },
    { key: 'artisan', label: t('pro.tab_artisan'), Icon: ShoppingBag, count: products?.length ?? 0 },
  ];

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
        {categories.map(({ key, label, Icon, count }) => (
          <button key={key} type="button" className={styles.categoryCard} onClick={() => onNavigate(key)}>
            <span className={styles.categoryIcon}>
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <span className={styles.categoryLabel}>{label}</span>
            <span className={styles.categoryCount}>{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

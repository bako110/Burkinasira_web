import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChartColumn, CalendarCheck, PackageSearch, Star } from 'lucide-react';
import clsx from 'clsx';

import type { ProviderItemType } from '../types';
import { AnalyticsTab } from './AnalyticsTab';
import { BookingsTab } from './BookingsTab';
import { ReviewsTab } from './ReviewsTab';
import styles from './EstablishmentDetailPanel.module.css';
import formStyles from './GuideProfileForm.module.css';

const DETAIL_TABS = [
  { key: 'analytics', Icon: ChartColumn },
  { key: 'bookings', Icon: CalendarCheck },
  { key: 'reviews', Icon: Star },
] as const;
type DetailTabKey = (typeof DETAIL_TABS)[number]['key'];

// Les commandes artisanales vivent dans un système séparé (artisan_orders, avec
// livraison/retrait) : l'onglet "Réservations" générique (collection bookings)
// n'y trouve jamais rien. Un produit a son propre écran dédié à la place.
const TABS_WITHOUT_BOOKINGS = DETAIL_TABS.filter((tab) => tab.key !== 'bookings');

const UNPUBLISHED_STATUSES = new Set(['draft', 'pending']);

interface EstablishmentDetailPanelProps {
  itemType: ProviderItemType;
  itemId: string;
  name: string;
  status?: string;
  logoUrl?: string;
  onBack: () => void;
}

export function EstablishmentDetailPanel({
  itemType,
  itemId,
  name,
  status,
  logoUrl,
  onBack,
}: EstablishmentDetailPanelProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTabKey>('analytics');

  const source = { itemType, itemId };
  const isUnpublished = status ? UNPUBLISHED_STATUSES.has(status) : false;
  const isProduct = itemType === 'product';
  const tabs = isProduct ? TABS_WITHOUT_BOOKINGS : DETAIL_TABS;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label={t('pro.backToList')}>
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <h3 className={styles.headerTitle}>{name}</h3>
        {isProduct && (
          <button
            type="button"
            className={styles.tab}
            style={{ marginLeft: 'auto', backgroundColor: 'var(--color-bg-inset)' }}
            onClick={() => navigate('/pro/provider/artisan/orders')}
          >
            <PackageSearch size={15} strokeWidth={2} />
            {t('pro.viewReceivedOrders')}
          </button>
        )}
      </div>

      {isUnpublished && (
        <div className={`${formStyles.statusBanner} ${formStyles.statusPending}`}>
          <Clock size={16} strokeWidth={2} />
          {status === 'draft' ? t('pro.draftNotice') : t('pro.pendingNotice')}
        </div>
      )}

      <div className={styles.tabs}>
        {tabs.map(({ key, Icon }) => (
          <button
            key={key}
            type="button"
            className={clsx(styles.tab, activeTab === key && styles.tabActive)}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={15} strokeWidth={2} />
            {t(`pro.tab_${key}`)}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && <AnalyticsTab source={source} />}
      {activeTab === 'bookings' && (
        <BookingsTab source={source} establishmentName={name} logoUrl={logoUrl} />
      )}
      {activeTab === 'reviews' && <ReviewsTab source={source} />}
    </div>
  );
}

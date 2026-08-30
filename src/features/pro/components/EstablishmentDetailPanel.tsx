import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock } from 'lucide-react';

import { Tabs } from '../../../shared/ui';
import type { ProviderItemType } from '../types';
import { AnalyticsTab } from './AnalyticsTab';
import { BookingsTab } from './BookingsTab';
import { ReviewsTab } from './ReviewsTab';
import styles from './HotelSection.module.css';
import formStyles from './GuideProfileForm.module.css';

const DETAIL_TAB_KEYS = ['analytics', 'bookings', 'reviews'] as const;
type DetailTabKey = (typeof DETAIL_TAB_KEYS)[number];

const UNPUBLISHED_STATUSES = new Set(['draft', 'pending']);

interface EstablishmentDetailPanelProps {
  itemType: ProviderItemType;
  itemId: string;
  name: string;
  status?: string;
  onBack: () => void;
}

export function EstablishmentDetailPanel({ itemType, itemId, name, status, onBack }: EstablishmentDetailPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<DetailTabKey>('analytics');

  const tabs = DETAIL_TAB_KEYS.map((key) => ({ key, label: t(`pro.tab_${key}`) }));
  const source = { itemType, itemId };
  const isUnpublished = status ? UNPUBLISHED_STATUSES.has(status) : false;

  return (
    <div className={styles.section}>
      <div className={styles.detailHeader}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('pro.backToList')}
        </button>
      </div>
      <h3 className={styles.headerTitle}>{name}</h3>

      {isUnpublished && (
        <div className={`${formStyles.statusBanner} ${formStyles.statusPending}`}>
          <Clock size={16} strokeWidth={2} />
          {status === 'draft' ? t('pro.draftNotice') : t('pro.pendingNotice')}
        </div>
      )}

      <Tabs items={tabs} active={activeTab} onChange={(key) => setActiveTab(key as DetailTabKey)} />

      {activeTab === 'analytics' && <AnalyticsTab source={source} />}
      {activeTab === 'bookings' && <BookingsTab source={source} />}
      {activeTab === 'reviews' && <ReviewsTab source={source} />}
    </div>
  );
}

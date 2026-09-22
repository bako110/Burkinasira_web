import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, ChartColumn, CalendarCheck, Star } from 'lucide-react';
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

  const source = { itemType, itemId };
  const isUnpublished = status ? UNPUBLISHED_STATUSES.has(status) : false;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label={t('pro.backToList')}>
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <h3 className={styles.headerTitle}>{name}</h3>
      </div>

      {isUnpublished && (
        <div className={`${formStyles.statusBanner} ${formStyles.statusPending}`}>
          <Clock size={16} strokeWidth={2} />
          {status === 'draft' ? t('pro.draftNotice') : t('pro.pendingNotice')}
        </div>
      )}

      <div className={styles.tabs}>
        {DETAIL_TABS.map(({ key, Icon }) => (
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
      {activeTab === 'bookings' && <BookingsTab source={source} />}
      {activeTab === 'reviews' && <ReviewsTab source={source} />}
    </div>
  );
}

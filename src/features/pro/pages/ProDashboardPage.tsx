import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import { OverviewTab } from '../components/OverviewTab';
import { HotelSection } from '../components/HotelSection';
import { RestaurantSection } from '../components/RestaurantSection';
import { TransportSection } from '../components/TransportSection';
import { ArtisanMarketSection } from '../components/ArtisanMarketSection';
import styles from './ProPageWrapper.module.css';

const TAB_KEYS = ['overview', 'hotel', 'restaurant', 'transport', 'artisan'] as const;
type TabKey = (typeof TAB_KEYS)[number];

export function ProDashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs = TAB_KEYS.map((key) => ({ key, label: t(`pro.tab_${key}`) }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('pro.providerDashboardTitle')}</h1>
        <p className={styles.subtitle}>{t('pro.dashboardSubtitle', { name: user?.full_name ?? '' })}</p>
      </div>

      <Tabs items={tabs} active={activeTab} onChange={(key) => setActiveTab(key as TabKey)} />

      <div className={styles.tabContent}>
        {activeTab === 'overview' && <OverviewTab onNavigate={(key) => setActiveTab(key as TabKey)} />}
        {activeTab === 'hotel' && <HotelSection />}
        {activeTab === 'restaurant' && <RestaurantSection />}
        {activeTab === 'transport' && <TransportSection />}
        {activeTab === 'artisan' && <ArtisanMarketSection />}
      </div>
    </div>
  );
}

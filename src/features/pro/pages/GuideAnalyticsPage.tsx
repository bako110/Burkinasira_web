import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../../store/auth.store';
import { ProPageHeader } from '../components/ProPageHeader';
import { AnalyticsTab } from '../components/AnalyticsTab';
import styles from './ProPageWrapper.module.css';

export function GuideAnalyticsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  return (
    <div className={styles.page}>
      <ProPageHeader
        title={t('pro.tab_analytics')}
        subtitle={t('pro.dashboardSubtitle', { name: user?.full_name ?? '' })}
      />
      <AnalyticsTab />
    </div>
  );
}

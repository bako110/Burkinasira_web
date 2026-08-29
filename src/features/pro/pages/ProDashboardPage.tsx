import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

import { Card } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import styles from './ProDashboardPage.module.css';

export function ProDashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const isGuide = user?.role === 'guide';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isGuide ? t('pro.guideDashboardTitle') : t('pro.providerDashboardTitle')}</h1>
        <p className={styles.subtitle}>{t('pro.dashboardSubtitle', { name: user?.full_name ?? '' })}</p>
      </div>

      <Card className={styles.tile}>
        <span className={styles.tileIcon}>
          <ShieldCheck size={22} strokeWidth={1.75} />
        </span>
        <span className={styles.tileLabel}>{t('pro.accountVerified')}</span>
        <span className={styles.tileDesc}>{t('pro.moreFeaturesComingSoon')}</span>
      </Card>
    </div>
  );
}

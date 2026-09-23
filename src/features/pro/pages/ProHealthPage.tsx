import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { HealthFacilitySection } from '../components/HealthFacilitySection';
import styles from './ProPageWrapper.module.css';

export function ProHealthPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_health')} />
      <HealthFacilitySection />
    </div>
  );
}

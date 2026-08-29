import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { AvailabilityTab } from '../components/AvailabilityTab';
import styles from './ProPageWrapper.module.css';

export function GuideAvailabilityPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_availability')} />
      <AvailabilityTab />
    </div>
  );
}

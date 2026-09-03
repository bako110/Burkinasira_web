import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { ReceivedReportsTab } from '../../dataQuality/components/ReceivedReportsTab';
import styles from './ProPageWrapper.module.css';

export function ProReportsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_reports')} subtitle={t('proReports.subtitle')} />
      <ReceivedReportsTab />
    </div>
  );
}

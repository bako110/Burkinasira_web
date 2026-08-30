import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { TransportSection } from '../components/TransportSection';
import styles from './ProPageWrapper.module.css';

export function ProTransportPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_transport')} />
      <TransportSection />
    </div>
  );
}

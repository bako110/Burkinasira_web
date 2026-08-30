import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { HotelSection } from '../components/HotelSection';
import styles from './ProPageWrapper.module.css';

export function ProHotelPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_hotel')} />
      <HotelSection />
    </div>
  );
}

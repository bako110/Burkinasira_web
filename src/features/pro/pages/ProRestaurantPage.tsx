import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { RestaurantSection } from '../components/RestaurantSection';
import styles from './ProPageWrapper.module.css';

export function ProRestaurantPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_restaurant')} />
      <RestaurantSection />
    </div>
  );
}

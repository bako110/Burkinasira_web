import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { BookingsTab } from '../components/BookingsTab';
import styles from './ProPageWrapper.module.css';

export function GuideBookingsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_bookings')} />
      <BookingsTab />
    </div>
  );
}

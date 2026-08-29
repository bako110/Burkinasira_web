import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { ReviewsTab } from '../components/ReviewsTab';
import styles from './ProPageWrapper.module.css';

export function GuideReviewsPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_reviews')} />
      <ReviewsTab />
    </div>
  );
}

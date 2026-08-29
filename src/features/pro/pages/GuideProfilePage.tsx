import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { GuideProfileForm } from '../components/GuideProfileForm';
import styles from './ProPageWrapper.module.css';

export function GuideProfilePage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_profile')} />
      <GuideProfileForm />
    </div>
  );
}

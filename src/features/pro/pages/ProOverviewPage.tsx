import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ProPageHeader } from '../components/ProPageHeader';
import { OverviewTab } from '../components/OverviewTab';
import styles from './ProPageWrapper.module.css';

export function ProOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_overview')} />
      <OverviewTab onNavigate={(key) => navigate(`/pro/provider/${key}`)} />
    </div>
  );
}

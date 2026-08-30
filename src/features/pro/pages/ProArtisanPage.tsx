import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { ArtisanMarketSection } from '../components/ArtisanMarketSection';
import styles from './ProPageWrapper.module.css';

export function ProArtisanPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_artisan')} />
      <ArtisanMarketSection />
    </div>
  );
}

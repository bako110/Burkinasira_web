import { useTranslation } from 'react-i18next';

import { ProPageHeader } from '../components/ProPageHeader';
import { EstablishmentPicker } from '../components/EstablishmentPicker';
import { TeamManagementSection } from '../components/TeamManagementSection';
import styles from './ProPageWrapper.module.css';

export function ProTeamPage() {
  const { t } = useTranslation();

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_team')} />
      <EstablishmentPicker>
        {(selected) => <TeamManagementSection itemType={selected.itemType} itemId={selected.itemId} />}
      </EstablishmentPicker>
    </div>
  );
}

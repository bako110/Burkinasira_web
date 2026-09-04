import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';

import { Spinner } from '../../../shared/ui';
import { ProPageHeader } from '../components/ProPageHeader';
import { OverviewTab } from '../components/OverviewTab';
import {
  useMyHotels,
  useMyRestaurants,
  useMyTransportProviders,
  useMyArtisanProfile,
} from '../hooks/useMyEstablishments';
import styles from './ProPageWrapper.module.css';

/**
 * Un prestataire n'a en général qu'UN type d'établissement : dans ce cas on le
 * pose directement sur la page de gestion correspondante (liste + ajout), au
 * lieu de la « Vue d'ensemble » avec ses tuiles. S'il possède plusieurs types
 * (ou aucun), on garde la vue d'ensemble comme sélecteur.
 */
export function ProOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: hotels, isLoading: l1 } = useMyHotels();
  const { data: restaurants, isLoading: l2 } = useMyRestaurants();
  const { data: transport, isLoading: l3 } = useMyTransportProviders();
  const { data: artisanProfile, isLoading: l4 } = useMyArtisanProfile();

  if (l1 || l2 || l3 || l4) {
    return (
      <div className={styles.page}>
        <Spinner size={24} />
      </div>
    );
  }

  const owned: string[] = [];
  if ((hotels?.length ?? 0) > 0) owned.push('hotel');
  if ((restaurants?.length ?? 0) > 0) owned.push('restaurant');
  if ((transport?.length ?? 0) > 0) owned.push('transport');
  if (artisanProfile) owned.push('artisan');

  if (owned.length === 1) {
    return <Navigate to={`/pro/provider/${owned[0]}`} replace />;
  }

  return (
    <div className={styles.page}>
      <ProPageHeader title={t('pro.tab_overview')} />
      <OverviewTab onNavigate={(key) => navigate(`/pro/provider/${key}`)} />
    </div>
  );
}

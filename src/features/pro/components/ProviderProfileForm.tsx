import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building, UtensilsCrossed, Car, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

import { Spinner } from '../../../shared/ui';
import { useMyHotels, useMyRestaurants, useMyTransportProviders, useMyArtisanProfile } from '../hooks/useMyEstablishments';
import { HotelForm } from './HotelForm';
import { RestaurantForm } from './RestaurantForm';
import { TransportProviderForm } from './TransportProviderForm';
import { ArtisanProfileForm } from './ArtisanProfileForm';
import styles from './ProviderProfileForm.module.css';

type EstablishmentKind = 'hotel' | 'restaurant' | 'transport' | 'artisan';

const KIND_OPTIONS: { value: EstablishmentKind; labelKey: string; Icon: typeof Building }[] = [
  { value: 'hotel', labelKey: 'pro.tab_hotel', Icon: Building },
  { value: 'restaurant', labelKey: 'pro.tab_restaurant', Icon: UtensilsCrossed },
  { value: 'transport', labelKey: 'pro.tab_transport', Icon: Car },
  { value: 'artisan', labelKey: 'pro.tab_artisan', Icon: ShoppingBag },
];

export function ProviderProfileForm() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<EstablishmentKind>('hotel');

  const { data: hotels, isLoading: isLoadingHotels } = useMyHotels();
  const { data: restaurants, isLoading: isLoadingRestaurants } = useMyRestaurants();
  const { data: transportProviders, isLoading: isLoadingTransport } = useMyTransportProviders();
  const { data: artisanProfile, isLoading: isLoadingArtisan } = useMyArtisanProfile();

  const submittedCount =
    (hotels?.length ?? 0) + (restaurants?.length ?? 0) + (transportProviders?.length ?? 0) + (artisanProfile ? 1 : 0);
  const isLoadingAny = isLoadingHotels || isLoadingRestaurants || isLoadingTransport || isLoadingArtisan;

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>{t('pro.providerProfileTitle')}</h2>
      <p className={styles.hint}>{t('pro.providerProfileHint')}</p>

      <div className={styles.kindTabs}>
        {KIND_OPTIONS.map(({ value, labelKey, Icon }) => (
          <button
            key={value}
            type="button"
            className={clsx(styles.kindTab, kind === value && styles.kindTabActive)}
            onClick={() => setKind(value)}
          >
            <Icon size={16} strokeWidth={2} />
            {t(labelKey)}
          </button>
        ))}
      </div>

      <div className={styles.formCard}>
        {kind === 'hotel' && <HotelForm onSaved={() => {}} onCancel={() => {}} />}
        {kind === 'restaurant' && <RestaurantForm onSaved={() => {}} onCancel={() => {}} />}
        {kind === 'transport' && <TransportProviderForm onSaved={() => {}} onCancel={() => {}} />}
        {kind === 'artisan' && <ArtisanProfileForm profile={artisanProfile ?? undefined} onSaved={() => {}} />}
      </div>

      <div className={styles.submittedSection}>
        <h3 className={styles.submittedTitle}>{t('pro.submittedEstablishments')}</h3>

        {isLoadingAny && <Spinner size={20} />}

        {!isLoadingAny && submittedCount === 0 && (
          <p className={styles.hint}>{t('pro.noEstablishmentsDesc')}</p>
        )}

        {!isLoadingAny && submittedCount > 0 && (
          <div className={styles.submittedList}>
            {hotels?.map((h) => (
              <div key={h.id} className={styles.submittedItem}>
                <span className={styles.submittedName}>{h.name}</span>
                <StatusBadge status={h.status} />
              </div>
            ))}
            {restaurants?.map((r) => (
              <div key={r.id} className={styles.submittedItem}>
                <span className={styles.submittedName}>{r.name}</span>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {transportProviders?.map((p) => (
              <div key={p.id} className={styles.submittedItem}>
                <span className={styles.submittedName}>{p.name}</span>
                <StatusBadge status={p.status === 'active' ? 'published' : p.status === 'pending' ? 'draft' : 'archived'} />
              </div>
            ))}
            {artisanProfile && (
              <div className={styles.submittedItem}>
                <span className={styles.submittedName}>{artisanProfile.display_name}</span>
                <StatusBadge
                  status={
                    artisanProfile.status === 'active'
                      ? 'published'
                      : artisanProfile.status === 'pending'
                        ? 'draft'
                        : 'archived'
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'draft' | 'published' | 'archived' }) {
  const { t } = useTranslation();
  if (status === 'published') {
    return (
      <span className={clsx(styles.badge, styles.badgePublished)}>
        <CheckCircle2 size={13} strokeWidth={2} />
        {t('pro.statusPublished')}
      </span>
    );
  }
  if (status === 'draft') {
    return (
      <span className={clsx(styles.badge, styles.badgeDraft)}>
        <Clock size={13} strokeWidth={2} />
        {t('pro.statusDraft')}
      </span>
    );
  }
  return <span className={clsx(styles.badge, styles.badgeArchived)}>{t('pro.statusArchived')}</span>;
}

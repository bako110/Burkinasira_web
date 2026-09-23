import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '../../../shared/ui';
import {
  useMyHotels,
  useMyRestaurants,
  useMyTransportProviders,
  useMyProducts,
  useMyHealthFacilities,
} from '../hooks/useMyEstablishments';
import type { ProviderItemType } from '../types';
import styles from './EstablishmentPicker.module.css';

export interface EstablishmentOption {
  itemType: ProviderItemType;
  itemId: string;
  label: string;
}

interface EstablishmentPickerProps {
  children: (selected: EstablishmentOption) => React.ReactNode;
}

export function EstablishmentPicker({ children }: EstablishmentPickerProps) {
  const { t } = useTranslation();
  const { data: hotels, isLoading: loadingHotels } = useMyHotels();
  const { data: restaurants, isLoading: loadingRestaurants } = useMyRestaurants();
  const { data: transportProviders, isLoading: loadingTransport } = useMyTransportProviders();
  const { data: products, isLoading: loadingProducts } = useMyProducts();
  const { data: healthFacilities, isLoading: loadingHealth } = useMyHealthFacilities();

  const isLoading = loadingHotels || loadingRestaurants || loadingTransport || loadingProducts || loadingHealth;

  const options: EstablishmentOption[] = [
    ...(hotels ?? []).map((h) => ({ itemType: 'hotel' as const, itemId: h.id, label: `${t('pro.tab_hotel')} — ${h.name}` })),
    ...(restaurants ?? []).map((r) => ({
      itemType: 'restaurant' as const,
      itemId: r.id,
      label: `${t('pro.tab_restaurant')} — ${r.name}`,
    })),
    ...(transportProviders ?? []).map((p) => ({
      itemType: 'transport' as const,
      itemId: p.id,
      label: `${t('pro.tab_transport')} — ${p.name}`,
    })),
    ...(products ?? []).map((p) => ({
      itemType: 'product' as const,
      itemId: p.id,
      label: `${t('pro.tab_artisan')} — ${p.name}`,
    })),
    ...(healthFacilities ?? []).map((h) => ({
      itemType: 'health' as const,
      itemId: h.id,
      label: `${t('pro.tab_health')} — ${h.name}`,
    })),
  ];

  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    if (!selectedId && options.length > 0) {
      setSelectedId(options[0].itemId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length]);

  if (isLoading) {
    return <Spinner size={22} />;
  }

  if (options.length === 0) {
    return (
      <div className={styles.empty}>
        <p>{t('pro.noEstablishments')}</p>
      </div>
    );
  }

  const selected = options.find((o) => o.itemId === selectedId) ?? options[0];

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label htmlFor="establishment_picker" className={styles.label}>
          {t('pro.myEstablishments')}
        </label>
        <select
          id="establishment_picker"
          className={styles.select}
          value={selected.itemId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.itemId} value={o.itemId}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {children(selected)}
    </div>
  );
}

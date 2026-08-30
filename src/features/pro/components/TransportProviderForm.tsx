import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { BURKINA_REGIONS } from '../../weather/types';
import type { TransportType, TransportProviderDetail } from '../../mobility/types';
import { useCreateMyTransportProvider, useUpdateMyTransportProvider } from '../hooks/useMyEstablishments';
import { MediaGalleryInput } from './MediaGalleryInput';
import formStyles from './GuideProfileForm.module.css';

const TRANSPORT_TYPES: TransportType[] = [
  'taxi_vtc',
  'chauffeur_prive',
  'location_voiture',
  'location_moto',
  'transport_interurbain',
  'transfert_aeroport',
  'transport_touristique_prive',
];

interface TransportProviderFormProps {
  provider?: TransportProviderDetail;
  onSaved: () => void;
  onCancel: () => void;
}

export function TransportProviderForm({ provider, onSaved, onCancel }: TransportProviderFormProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const createProvider = useCreateMyTransportProvider();
  const updateProvider = useUpdateMyTransportProvider();

  const [name, setName] = useState(provider?.name ?? '');
  const [type, setType] = useState<TransportType>(provider?.type ?? 'taxi_vtc');
  const [description, setDescription] = useState(provider?.description ?? '');
  const [region, setRegion] = useState(provider?.region ?? BURKINA_REGIONS[0]);
  const [province, setProvince] = useState(provider?.province ?? '');
  const [city, setCity] = useState(provider?.city ?? '');
  const [latitude, setLatitude] = useState(
    provider?.base_location?.latitude !== undefined ? String(provider.base_location.latitude) : '',
  );
  const [longitude, setLongitude] = useState(
    provider?.base_location?.longitude !== undefined ? String(provider.base_location.longitude) : '',
  );
  const [vehicleInfo, setVehicleInfo] = useState(provider?.vehicle_info ?? '');
  const [priceEstimate, setPriceEstimate] = useState(
    provider?.price_estimate !== undefined ? String(provider.price_estimate) : '',
  );
  const [contactPhone, setContactPhone] = useState(provider?.contact_phone ?? '');
  const [photos, setPhotos] = useState<string[]>(provider?.photos ?? []);
  const [videos, setVideos] = useState<string[]>(provider?.videos ?? []);
  const [photos360, setPhotos360] = useState<string[]>(provider?.photos_360 ?? []);

  const isSaving = createProvider.isPending || updateProvider.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      type,
      description: description || undefined,
      region,
      province: province || undefined,
      city: city || undefined,
      base_location:
        latitude || longitude ? { latitude: Number(latitude) || 0, longitude: Number(longitude) || 0 } : undefined,
      vehicle_info: vehicleInfo || undefined,
      photos,
      videos,
      photos_360: photos360,
      price_estimate: priceEstimate ? Number(priceEstimate) : undefined,
      price_currency: 'XOF',
      contact_phone: contactPhone,
    };

    const onSettled = {
      onSuccess: () => {
        push({ variant: 'success', message: t('pro.establishmentSaved') });
        onSaved();
      },
      onError: (err: unknown) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    };

    if (provider) {
      updateProvider.mutate({ id: provider.id, payload }, onSettled);
    } else {
      createProvider.mutate(payload, onSettled);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <div className={formStyles.field}>
        <label htmlFor="transport_name" className={formStyles.label}>
          {t('pro.name')}
        </label>
        <input
          id="transport_name"
          className={formStyles.input}
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="transport_type" className={formStyles.label}>
          {t('pro.type')}
        </label>
        <select
          id="transport_type"
          className={formStyles.select}
          value={type}
          onChange={(e) => setType(e.target.value as TransportType)}
        >
          {TRANSPORT_TYPES.map((option) => (
            <option key={option} value={option}>
              {t(`mobility.types.${option}`, option)}
            </option>
          ))}
        </select>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="transport_description" className={formStyles.label}>
          {t('pro.description')}
        </label>
        <textarea
          id="transport_description"
          className={formStyles.textarea}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <MediaGalleryInput
        label={t('pro.photosAndVideos')}
        photos={photos}
        videos={videos}
        onPhotosChange={setPhotos}
        onVideosChange={setVideos}
        photos360={photos360}
        onPhotos360Change={setPhotos360}
      />

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="transport_region" className={formStyles.label}>
            {t('pro.region')}
          </label>
          <select
            id="transport_region"
            className={formStyles.select}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            {BURKINA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={formStyles.field}>
          <label htmlFor="transport_province" className={formStyles.label}>
            {t('pro.province')}
          </label>
          <input
            id="transport_province"
            className={formStyles.input}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="transport_city" className={formStyles.label}>
            {t('pro.city')}
          </label>
          <input
            id="transport_city"
            className={formStyles.input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="transport_vehicle_info" className={formStyles.label}>
            {t('pro.vehicleInfo')}
          </label>
          <input
            id="transport_vehicle_info"
            className={formStyles.input}
            value={vehicleInfo}
            onChange={(e) => setVehicleInfo(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="transport_latitude" className={formStyles.label}>
            {t('pro.latitude')}
          </label>
          <input
            id="transport_latitude"
            type="number"
            step="any"
            className={formStyles.input}
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="transport_longitude" className={formStyles.label}>
            {t('pro.longitude')}
          </label>
          <input
            id="transport_longitude"
            type="number"
            step="any"
            className={formStyles.input}
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="transport_price_estimate" className={formStyles.label}>
            {t('pro.priceEstimate')}
          </label>
          <input
            id="transport_price_estimate"
            type="number"
            step="any"
            className={formStyles.input}
            value={priceEstimate}
            onChange={(e) => setPriceEstimate(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="transport_phone" className={formStyles.label}>
            {t('pro.contactPhone')}
          </label>
          <input
            id="transport_phone"
            type="tel"
            className={formStyles.input}
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
          {t('pro.cancel')}
        </Button>
        <Button type="submit" fullWidth disabled={isSaving}>
          {isSaving ? <Spinner size={18} /> : t('pro.save')}
        </Button>
      </div>
    </form>
  );
}

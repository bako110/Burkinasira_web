import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { BURKINA_REGIONS } from '../../weather/types';
import type { AccommodationType, HotelDetail } from '../../hotels/types';
import { useCreateMyHotel, useUpdateMyHotel } from '../hooks/useMyEstablishments';
import { MediaGalleryInput } from './MediaGalleryInput';
import formStyles from './GuideProfileForm.module.css';

const ACCOMMODATION_TYPES: AccommodationType[] = [
  'hotel',
  'auberge',
  'campement',
  'maison_hotes',
  'residence',
  'hebergement_habitant',
  'hebergement_communautaire',
];

interface HotelFormProps {
  hotel?: HotelDetail;
  onSaved: () => void;
  onCancel: () => void;
}

export function HotelForm({ hotel, onSaved, onCancel }: HotelFormProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const createHotel = useCreateMyHotel();
  const updateHotel = useUpdateMyHotel();

  const [name, setName] = useState(hotel?.name ?? '');
  const [type, setType] = useState<AccommodationType>(hotel?.type ?? 'hotel');
  const [description, setDescription] = useState(hotel?.description ?? '');
  const [region, setRegion] = useState(hotel?.region ?? BURKINA_REGIONS[0]);
  const [province, setProvince] = useState(hotel?.province ?? '');
  const [city, setCity] = useState(hotel?.city ?? '');
  const [address, setAddress] = useState(hotel?.address ?? '');
  const [latitude, setLatitude] = useState(hotel?.location?.latitude !== undefined ? String(hotel.location.latitude) : '');
  const [longitude, setLongitude] = useState(hotel?.location?.longitude !== undefined ? String(hotel.location.longitude) : '');
  const [contactPhone, setContactPhone] = useState(hotel?.contact_phone ?? '');
  const [contactEmail, setContactEmail] = useState(hotel?.contact_email ?? '');
  const [photos, setPhotos] = useState<string[]>(hotel?.photos ?? []);
  const [videos, setVideos] = useState<string[]>(hotel?.videos ?? []);
  const [photos360, setPhotos360] = useState<string[]>(hotel?.photos_360 ?? []);

  const isSaving = createHotel.isPending || updateHotel.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      type,
      description,
      region,
      province: province || undefined,
      city: city || undefined,
      location: { latitude: Number(latitude) || 0, longitude: Number(longitude) || 0 },
      address: address || undefined,
      contact_phone: contactPhone || undefined,
      contact_email: contactEmail || undefined,
      photos,
      videos,
      photos_360: photos360,
    };

    const onSettled = {
      onSuccess: () => {
        push({ variant: 'success', message: t('pro.establishmentSaved') });
        onSaved();
      },
      onError: (err: unknown) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    };

    if (hotel) {
      updateHotel.mutate({ id: hotel.id, payload }, onSettled);
    } else {
      createHotel.mutate(payload, onSettled);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <div className={formStyles.field}>
        <label htmlFor="hotel_name" className={formStyles.label}>
          {t('pro.name')}
        </label>
        <input
          id="hotel_name"
          className={formStyles.input}
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="hotel_type" className={formStyles.label}>
          {t('pro.type')}
        </label>
        <select
          id="hotel_type"
          className={formStyles.select}
          value={type}
          onChange={(e) => setType(e.target.value as AccommodationType)}
        >
          {ACCOMMODATION_TYPES.map((option) => (
            <option key={option} value={option}>
              {t(`hotels.types.${option}`, option)}
            </option>
          ))}
        </select>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="hotel_description" className={formStyles.label}>
          {t('pro.description')}
        </label>
        <textarea
          id="hotel_description"
          className={formStyles.textarea}
          rows={3}
          required
          minLength={10}
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
          <label htmlFor="hotel_region" className={formStyles.label}>
            {t('pro.region')}
          </label>
          <select id="hotel_region" className={formStyles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
            {BURKINA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={formStyles.field}>
          <label htmlFor="hotel_province" className={formStyles.label}>
            {t('pro.province')}
          </label>
          <input
            id="hotel_province"
            className={formStyles.input}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="hotel_city" className={formStyles.label}>
            {t('pro.city')}
          </label>
          <input id="hotel_city" className={formStyles.input} value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="hotel_address" className={formStyles.label}>
            {t('pro.address')}
          </label>
          <input
            id="hotel_address"
            className={formStyles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="hotel_latitude" className={formStyles.label}>
            {t('pro.latitude')}
          </label>
          <input
            id="hotel_latitude"
            type="number"
            step="any"
            className={formStyles.input}
            required
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="hotel_longitude" className={formStyles.label}>
            {t('pro.longitude')}
          </label>
          <input
            id="hotel_longitude"
            type="number"
            step="any"
            className={formStyles.input}
            required
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="hotel_phone" className={formStyles.label}>
            {t('pro.contactPhone')}
          </label>
          <input
            id="hotel_phone"
            type="tel"
            className={formStyles.input}
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="hotel_email" className={formStyles.label}>
            {t('pro.contactEmail')}
          </label>
          <input
            id="hotel_email"
            type="email"
            className={formStyles.input}
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
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

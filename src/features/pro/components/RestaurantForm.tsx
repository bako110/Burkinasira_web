import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { BURKINA_REGIONS } from '../../weather/types';
import type { EstablishmentType, RestaurantDetail } from '../../restaurants/types';
import { useCreateMyRestaurant, useUpdateMyRestaurant } from '../hooks/useMyEstablishments';
import { MediaGalleryInput } from './MediaGalleryInput';
import formStyles from './GuideProfileForm.module.css';

const ESTABLISHMENT_TYPES: EstablishmentType[] = [
  'restaurant',
  'maquis',
  'cafe',
  'street_food',
  'etablissement_touristique',
];

interface RestaurantFormProps {
  restaurant?: RestaurantDetail;
  onSaved: () => void;
  onCancel: () => void;
}

export function RestaurantForm({ restaurant, onSaved, onCancel }: RestaurantFormProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const createRestaurant = useCreateMyRestaurant();
  const updateRestaurant = useUpdateMyRestaurant();

  const [name, setName] = useState(restaurant?.name ?? '');
  const [type, setType] = useState<EstablishmentType>(restaurant?.type ?? 'restaurant');
  const [description, setDescription] = useState(restaurant?.description ?? '');
  const [cuisineStyle, setCuisineStyle] = useState(restaurant?.cuisine_style ?? '');
  const [region, setRegion] = useState(restaurant?.region ?? BURKINA_REGIONS[0]);
  const [province, setProvince] = useState(restaurant?.province ?? '');
  const [city, setCity] = useState(restaurant?.city ?? '');
  const [address, setAddress] = useState(restaurant?.address ?? '');
  const [latitude, setLatitude] = useState(
    restaurant?.location?.latitude !== undefined ? String(restaurant.location.latitude) : '',
  );
  const [longitude, setLongitude] = useState(
    restaurant?.location?.longitude !== undefined ? String(restaurant.location.longitude) : '',
  );
  const [acceptsTableBooking, setAcceptsTableBooking] = useState(restaurant?.accepts_table_booking ?? true);
  const [offersTakeaway, setOffersTakeaway] = useState(restaurant?.offers_takeaway ?? false);
  const [contactPhone, setContactPhone] = useState(restaurant?.contact_phone ?? '');
  const [contactEmail, setContactEmail] = useState(restaurant?.contact_email ?? '');
  const [photos, setPhotos] = useState<string[]>(restaurant?.photos ?? []);
  const [videos, setVideos] = useState<string[]>(restaurant?.videos ?? []);

  const isSaving = createRestaurant.isPending || updateRestaurant.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      type,
      description,
      cuisine_style: cuisineStyle || undefined,
      region,
      province: province || undefined,
      city: city || undefined,
      location: { latitude: Number(latitude) || 0, longitude: Number(longitude) || 0 },
      address: address || undefined,
      accepts_table_booking: acceptsTableBooking,
      offers_takeaway: offersTakeaway,
      contact_phone: contactPhone || undefined,
      contact_email: contactEmail || undefined,
      photos,
      videos,
    };

    const onSettled = {
      onSuccess: () => {
        push({ variant: 'success', message: t('pro.establishmentSaved') });
        onSaved();
      },
      onError: (err: unknown) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    };

    if (restaurant) {
      updateRestaurant.mutate({ id: restaurant.id, payload }, onSettled);
    } else {
      createRestaurant.mutate(payload, onSettled);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <div className={formStyles.field}>
        <label htmlFor="restaurant_name" className={formStyles.label}>
          {t('pro.name')}
        </label>
        <input
          id="restaurant_name"
          className={formStyles.input}
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="restaurant_type" className={formStyles.label}>
          {t('pro.type')}
        </label>
        <select
          id="restaurant_type"
          className={formStyles.select}
          value={type}
          onChange={(e) => setType(e.target.value as EstablishmentType)}
        >
          {ESTABLISHMENT_TYPES.map((option) => (
            <option key={option} value={option}>
              {t(`restaurants.types.${option}`, option)}
            </option>
          ))}
        </select>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="restaurant_description" className={formStyles.label}>
          {t('pro.description')}
        </label>
        <textarea
          id="restaurant_description"
          className={formStyles.textarea}
          rows={3}
          required
          minLength={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="restaurant_cuisine_style" className={formStyles.label}>
          {t('pro.cuisineStyle')}
        </label>
        <input
          id="restaurant_cuisine_style"
          className={formStyles.input}
          value={cuisineStyle}
          onChange={(e) => setCuisineStyle(e.target.value)}
        />
      </div>

      <MediaGalleryInput
        label={t('pro.photosAndVideos')}
        photos={photos}
        videos={videos}
        onPhotosChange={setPhotos}
        onVideosChange={setVideos}
      />

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_region" className={formStyles.label}>
            {t('pro.region')}
          </label>
          <select
            id="restaurant_region"
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
          <label htmlFor="restaurant_province" className={formStyles.label}>
            {t('pro.province')}
          </label>
          <input
            id="restaurant_province"
            className={formStyles.input}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_city" className={formStyles.label}>
            {t('pro.city')}
          </label>
          <input
            id="restaurant_city"
            className={formStyles.input}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_address" className={formStyles.label}>
            {t('pro.address')}
          </label>
          <input
            id="restaurant_address"
            className={formStyles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_latitude" className={formStyles.label}>
            {t('pro.latitude')}
          </label>
          <input
            id="restaurant_latitude"
            type="number"
            step="any"
            className={formStyles.input}
            required
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_longitude" className={formStyles.label}>
            {t('pro.longitude')}
          </label>
          <input
            id="restaurant_longitude"
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
          <label htmlFor="restaurant_accepts_table_booking" className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="restaurant_accepts_table_booking"
              type="checkbox"
              checked={acceptsTableBooking}
              onChange={(e) => setAcceptsTableBooking(e.target.checked)}
            />
            {t('pro.acceptsTableBooking')}
          </label>
        </div>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_offers_takeaway" className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="restaurant_offers_takeaway"
              type="checkbox"
              checked={offersTakeaway}
              onChange={(e) => setOffersTakeaway(e.target.checked)}
            />
            {t('pro.offersTakeaway')}
          </label>
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_phone" className={formStyles.label}>
            {t('pro.contactPhone')}
          </label>
          <input
            id="restaurant_phone"
            type="tel"
            className={formStyles.input}
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="restaurant_email" className={formStyles.label}>
            {t('pro.contactEmail')}
          </label>
          <input
            id="restaurant_email"
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

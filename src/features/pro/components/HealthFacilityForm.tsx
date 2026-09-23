import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { BURKINA_REGIONS } from '../../weather/types';
import type { HealthFacilityType, HealthFacilityDetail } from '../../health/types';
import type { OpeningHoursPayload } from '../types';
import { useCreateMyHealthFacility, useUpdateMyHealthFacility } from '../hooks/useMyEstablishments';
import { LocationPicker } from '../../../shared/ui/LocationPicker';
import { OpeningHoursEditor } from './OpeningHoursEditor';
import formStyles from './GuideProfileForm.module.css';

const HEALTH_FACILITY_TYPES: HealthFacilityType[] = [
  'pharmacie',
  'hopital',
  'clinique',
  'laboratoire',
  'centre_premiers_secours',
  'dentiste',
  'autre',
];

interface HealthFacilityFormProps {
  facility?: HealthFacilityDetail;
  onSaved: () => void;
  onCancel: () => void;
}

export function HealthFacilityForm({ facility, onSaved, onCancel }: HealthFacilityFormProps) {
  const { t } = useTranslation();
  const push = useToastStore((s) => s.push);
  const createFacility = useCreateMyHealthFacility();
  const updateFacility = useUpdateMyHealthFacility();

  const [name, setName] = useState(facility?.name ?? '');
  const [type, setType] = useState<HealthFacilityType>(facility?.type ?? 'pharmacie');
  const [description, setDescription] = useState(facility?.description ?? '');
  const [region, setRegion] = useState(facility?.region ?? BURKINA_REGIONS[0]);
  const [province, setProvince] = useState(facility?.province ?? '');
  const [city, setCity] = useState(facility?.city ?? '');
  const [address, setAddress] = useState(facility?.address ?? '');
  const [latitude, setLatitude] = useState(
    facility?.location?.latitude !== undefined ? String(facility.location.latitude) : '',
  );
  const [longitude, setLongitude] = useState(
    facility?.location?.longitude !== undefined ? String(facility.location.longitude) : '',
  );
  const [isOnDuty, setIsOnDuty] = useState(facility?.is_on_duty ?? false);
  const [services, setServices] = useState(facility?.services?.join(', ') ?? '');
  const [openingHours, setOpeningHours] = useState<OpeningHoursPayload[]>(facility?.opening_hours ?? []);
  const [contactPhone, setContactPhone] = useState(facility?.contact_phone ?? '');

  const isSaving = createFacility.isPending || updateFacility.isPending;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      type,
      description: description || undefined,
      region,
      province: province || undefined,
      city: city || undefined,
      location: { latitude: Number(latitude) || 0, longitude: Number(longitude) || 0 },
      address: address || undefined,
      is_on_duty: isOnDuty,
      services: services.split(',').map((s) => s.trim()).filter(Boolean),
      opening_hours: openingHours,
      contact_phone: contactPhone || undefined,
    };

    const onSettled = {
      onSuccess: () => {
        push({ variant: 'success', message: t('pro.establishmentSaved') });
        onSaved();
      },
      onError: (err: unknown) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    };

    if (facility) {
      updateFacility.mutate({ id: facility.id, payload }, onSettled);
    } else {
      createFacility.mutate(payload, onSettled);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      <div className={formStyles.field}>
        <label htmlFor="health_name" className={formStyles.label}>
          {t('pro.name')}
        </label>
        <input
          id="health_name"
          className={formStyles.input}
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="health_type" className={formStyles.label}>
          {t('pro.type')}
        </label>
        <select
          id="health_type"
          className={formStyles.select}
          value={type}
          onChange={(e) => setType(e.target.value as HealthFacilityType)}
        >
          {HEALTH_FACILITY_TYPES.map((option) => (
            <option key={option} value={option}>
              {t(`health.types.${option}`, option)}
            </option>
          ))}
        </select>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="health_description" className={formStyles.label}>
          {t('pro.description')}
        </label>
        <textarea
          id="health_description"
          className={formStyles.textarea}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="health_region" className={formStyles.label}>
            {t('pro.region')}
          </label>
          <select id="health_region" className={formStyles.select} value={region} onChange={(e) => setRegion(e.target.value)}>
            {BURKINA_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className={formStyles.field}>
          <label htmlFor="health_province" className={formStyles.label}>
            {t('pro.province')}
          </label>
          <input
            id="health_province"
            className={formStyles.input}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.row}>
        <div className={formStyles.field}>
          <label htmlFor="health_city" className={formStyles.label}>
            {t('pro.city')}
          </label>
          <input id="health_city" className={formStyles.input} value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className={formStyles.field}>
          <label htmlFor="health_address" className={formStyles.label}>
            {t('pro.address')}
          </label>
          <input
            id="health_address"
            className={formStyles.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className={formStyles.field}>
        <label className={formStyles.label}>{t('pro.location')}</label>
        <LocationPicker
          latitude={latitude}
          longitude={longitude}
          onChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }}
          myLocationLabel={t('pro.myLocation')}
          locatingLabel={t('pro.locating')}
          geoErrorLabel={t('pro.geoError')}
        />
      </div>

      <div className={formStyles.field}>
        <label htmlFor="health_services" className={formStyles.label}>
          {t('pro.healthServices')}
        </label>
        <input
          id="health_services"
          className={formStyles.input}
          placeholder={t('pro.healthServicesPlaceholder')}
          value={services}
          onChange={(e) => setServices(e.target.value)}
        />
      </div>

      <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />

      <div className={formStyles.field}>
        <label
          htmlFor="health_is_on_duty"
          className={formStyles.label}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <input
            id="health_is_on_duty"
            type="checkbox"
            checked={isOnDuty}
            onChange={(e) => setIsOnDuty(e.target.checked)}
          />
          {t('pro.isOnDuty')}
        </label>
      </div>

      <div className={formStyles.field}>
        <label htmlFor="health_phone" className={formStyles.label}>
          {t('pro.contactPhone')}
        </label>
        <input
          id="health_phone"
          type="tel"
          className={formStyles.input}
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
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

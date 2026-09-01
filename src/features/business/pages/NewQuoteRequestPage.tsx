import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, Input, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateQuoteRequest } from '../hooks/useCreateQuoteRequest';
import { ServiceTypePicker } from '../components/ServiceTypePicker';
import type { BusinessServiceType } from '../types';
import styles from './NewQuoteRequestPage.module.css';

export function NewQuoteRequestPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateQuoteRequest();

  const [companyName, setCompanyName] = useState('');
  const [serviceTypes, setServiceTypes] = useState<BusinessServiceType[]>([]);
  const [region, setRegion] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [participantCount, setParticipantCount] = useState('1');
  const [notes, setNotes] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      {
        company_name: companyName,
        service_types: serviceTypes,
        region: region.trim() || undefined,
        event_date: eventDate ? new Date(eventDate).toISOString() : undefined,
        participant_count: Number(participantCount),
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: (quote) => navigate(`/business/quotes/${quote.id}`),
      },
    );
  }

  const canSubmit =
    companyName.trim().length >= 2 && serviceTypes.length > 0 && Number(participantCount) > 0;

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/business" variant="link">
        {t('common.back')}
      </DetailBackButton>
      <h1 className={styles.title}>{t('business.newQuoteTitle')}</h1>
      <p className={styles.subtitle}>{t('business.newQuoteSubtitle')}</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label={t('business.companyName')}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          minLength={2}
          required
        />

        <div className={styles.field}>
          <label className={styles.label}>{t('business.serviceTypesLabel')}</label>
          <ServiceTypePicker selected={serviceTypes} onChange={setServiceTypes} />
        </div>

        <Input
          label={t('business.regionOptional')}
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <Input
          label={t('business.eventDateOptional')}
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <Input
          label={t('business.participantCount')}
          type="number"
          min={1}
          value={participantCount}
          onChange={(e) => setParticipantCount(e.target.value)}
          required
        />

        <Input
          label={t('family.notesOptional')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}

        <Button type="submit" fullWidth disabled={isPending || !canSubmit}>
          {isPending ? t('common.loading') : t('business.submitQuoteRequest')}
        </Button>
      </form>
    </div>
  );
}

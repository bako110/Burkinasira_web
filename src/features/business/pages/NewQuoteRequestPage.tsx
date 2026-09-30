import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  MapPin,
  CalendarDays,
  Users,
  Minus,
  Plus,
  StickyNote,
  Send,
  Check,
} from 'lucide-react';
import clsx from 'clsx';

import { Spinner, DetailBackButton, Reveal } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useCreateQuoteRequest } from '../hooks/useCreateQuoteRequest';
import { ServiceTypePicker } from '../components/ServiceTypePicker';
import type { BusinessServiceType } from '../types';
import styles from './NewQuoteRequestPage.module.css';

const PARTICIPANT_PRESETS = [10, 25, 50, 100];
const NOTES_MAX = 500;

export function NewQuoteRequestPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateQuoteRequest();

  const [companyName, setCompanyName] = useState('');
  const [serviceTypes, setServiceTypes] = useState<BusinessServiceType[]>([]);
  const [region, setRegion] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [participantCount, setParticipantCount] = useState(1);
  const [notes, setNotes] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate(
      {
        company_name: companyName.trim(),
        service_types: serviceTypes,
        region: region.trim() || undefined,
        event_date: eventDate ? new Date(eventDate).toISOString() : undefined,
        participant_count: participantCount,
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: (quote) => navigate(`/business/quotes/${quote.id}`),
      },
    );
  }

  const stepCompany = companyName.trim().length >= 2;
  const stepServices = serviceTypes.length > 0;
  // L'étape 3 n'est « complétée » que si l'utilisateur a précisé quelque chose (la date ou un effectif).
  const stepEvent = Boolean(eventDate) || participantCount > 1;
  const done = [stepCompany, stepServices, stepEvent].filter(Boolean).length;
  const canSubmit = stepCompany && stepServices;

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  function setParticipants(value: number) {
    setParticipantCount(Math.max(1, Math.min(10000, Math.round(value) || 1)));
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/business" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.kicker}>
            <Briefcase size={13} strokeWidth={2} />
            {t('nav.business')}
          </span>
          <h1 className={styles.title}>{t('business.newQuoteTitle')}</h1>
          <p className={styles.subtitle}>{t('business.newQuoteSubtitle')}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className={styles.layout}>
        <div className={styles.steps}>
          {/* Étape 1 */}
          <Reveal as="section" className={styles.stepCard}>
            <header className={styles.stepHeader}>
              <span className={clsx(styles.stepNum, stepCompany && styles.stepNumDone)}>
                {stepCompany ? <Check size={16} strokeWidth={3} /> : 1}
              </span>
              <h2 className={styles.stepTitle}>{t('business.form.stepCompany')}</h2>
            </header>
            <label className={styles.field}>
              <span className={styles.label}>{t('business.companyName')}</span>
              <span className={styles.control}>
                <Building2 size={18} strokeWidth={1.75} className={styles.controlIcon} />
                <input
                  className={styles.input}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  minLength={2}
                  required
                  autoComplete="organization"
                  placeholder={t('business.form.companyPlaceholder')}
                />
              </span>
            </label>
          </Reveal>

          {/* Étape 2 */}
          <Reveal as="section" delay={60} className={styles.stepCard}>
            <header className={styles.stepHeader}>
              <span className={clsx(styles.stepNum, stepServices && styles.stepNumDone)}>
                {stepServices ? <Check size={16} strokeWidth={3} /> : 2}
              </span>
              <h2 className={styles.stepTitle}>{t('business.serviceTypesLabel')}</h2>
              <span className={clsx(styles.counter, stepServices && styles.counterActive)}>
                {t('business.form.selectedCount', { count: serviceTypes.length })}
              </span>
            </header>
            <ServiceTypePicker selected={serviceTypes} onChange={setServiceTypes} />
          </Reveal>

          {/* Étape 3 */}
          <Reveal as="section" delay={120} className={styles.stepCard}>
            <header className={styles.stepHeader}>
              <span className={clsx(styles.stepNum, stepEvent && styles.stepNumDone)}>
                {stepEvent ? <Check size={16} strokeWidth={3} /> : 3}
              </span>
              <h2 className={styles.stepTitle}>{t('business.form.stepEvent')}</h2>
            </header>

            <div className={styles.fieldRow}>
              <label className={styles.field}>
                <span className={styles.label}>{t('business.regionOptional')}</span>
                <span className={styles.control}>
                  <MapPin size={18} strokeWidth={1.75} className={styles.controlIcon} />
                  <input
                    className={styles.input}
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder={t('business.form.regionPlaceholder')}
                  />
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.label}>{t('business.eventDateOptional')}</span>
                <span className={styles.control}>
                  <CalendarDays size={18} strokeWidth={1.75} className={styles.controlIcon} />
                  <input
                    className={styles.input}
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </span>
              </label>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>{t('business.participantCount')}</span>
              <div className={styles.participants}>
                <div className={styles.stepper}>
                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() => setParticipants(participantCount - 1)}
                    disabled={participantCount <= 1}
                    aria-label={t('business.form.decrease')}
                  >
                    <Minus size={16} strokeWidth={2.25} />
                  </button>
                  <input
                    className={styles.stepperInput}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={participantCount}
                    onChange={(e) => setParticipants(Number(e.target.value))}
                    aria-label={t('business.participantCount')}
                  />
                  <button
                    type="button"
                    className={styles.stepperBtn}
                    onClick={() => setParticipants(participantCount + 1)}
                    aria-label={t('business.form.increase')}
                  >
                    <Plus size={16} strokeWidth={2.25} />
                  </button>
                </div>
                <div className={styles.presets}>
                  {PARTICIPANT_PRESETS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={clsx(styles.preset, participantCount === n && styles.presetActive)}
                      onClick={() => setParticipants(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className={styles.field}>
              <span className={styles.label}>{t('family.notesOptional')}</span>
              <span className={clsx(styles.control, styles.controlArea)}>
                <StickyNote size={18} strokeWidth={1.75} className={styles.controlIcon} />
                <textarea
                  className={clsx(styles.input, styles.textarea)}
                  value={notes}
                  maxLength={NOTES_MAX}
                  rows={4}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('business.form.notesPlaceholder')}
                />
              </span>
              <span className={styles.charCount}>
                {notes.length}/{NOTES_MAX}
              </span>
            </label>
          </Reveal>
        </div>

        {/* Récapitulatif dynamique */}
        <aside className={styles.summary}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>{t('business.form.summaryTitle')}</h2>

            <div className={styles.progress} aria-hidden="true">
              <span className={styles.progressFill} style={{ width: `${(done / 3) * 100}%` }} />
            </div>
            <p className={styles.progressText}>{t('business.form.progress', { done, total: 3 })}</p>

            <dl className={styles.summaryList}>
              <div className={styles.summaryRow}>
                <dt>
                  <Building2 size={15} strokeWidth={2} />
                  {t('business.companyName')}
                </dt>
                <dd className={clsx(!companyName.trim() && styles.muted)}>
                  {companyName.trim() || t('business.form.notSet')}
                </dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>
                  <Briefcase size={15} strokeWidth={2} />
                  {t('business.serviceTypesLabel')}
                </dt>
                <dd>
                  {serviceTypes.length === 0 ? (
                    <span className={styles.muted}>{t('business.form.notSet')}</span>
                  ) : (
                    <span className={styles.pills}>
                      {serviceTypes.map((s) => (
                        <span key={s} className={styles.pill}>
                          {t(`business.serviceTypes.${s}`)}
                        </span>
                      ))}
                    </span>
                  )}
                </dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>
                  <Users size={15} strokeWidth={2} />
                  {t('business.participantCount')}
                </dt>
                <dd>{participantCount}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>
                  <CalendarDays size={15} strokeWidth={2} />
                  {t('business.form.dateLabel')}
                </dt>
                <dd className={clsx(!formattedDate && styles.muted)}>{formattedDate ?? t('business.form.notSet')}</dd>
              </div>
              <div className={styles.summaryRow}>
                <dt>
                  <MapPin size={15} strokeWidth={2} />
                  {t('business.form.regionLabel')}
                </dt>
                <dd className={clsx(!region.trim() && styles.muted)}>{region.trim() || t('business.form.notSet')}</dd>
              </div>
            </dl>

            {error && <p className={styles.error}>{extractApiErrorMessage(error, t('common.error'))}</p>}

            <button type="submit" className={styles.submit} disabled={isPending || !canSubmit}>
              {isPending ? <Spinner size={18} /> : <Send size={17} strokeWidth={2} />}
              {isPending ? t('common.loading') : t('business.submitQuoteRequest')}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

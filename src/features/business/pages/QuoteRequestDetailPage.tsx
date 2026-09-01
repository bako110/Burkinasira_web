import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Users, ArrowLeft, Trash2, UserPlus } from 'lucide-react';
import clsx from 'clsx';

import { Button, Input, Spinner, EmptyResults, DetailBackButton } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useQuoteRequestDetail } from '../hooks/useQuoteRequestDetail';
import { useEventParticipants } from '../hooks/useEventParticipants';
import { useAddEventParticipant } from '../hooks/useAddEventParticipant';
import { useRemoveEventParticipant } from '../hooks/useRemoveEventParticipant';
import styles from './QuoteRequestDetailPage.module.css';

export function QuoteRequestDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: quote, isLoading, isError, refetch } = useQuoteRequestDetail(id);
  const { data: participants } = useEventParticipants(id);
  const { mutate: addParticipant, isPending: isAdding, error: addError } = useAddEventParticipant(id ?? '');
  const { mutate: removeParticipant } = useRemoveEventParticipant(id ?? '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addParticipant(
      { full_name: name, email: email.trim() || undefined },
      { onSuccess: () => { setName(''); setEmail(''); } },
    );
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !quote) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('business.detailNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/business')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('nav.business')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/business" variant="link">
        {t('common.back')}
      </DetailBackButton>

      <div className={styles.header}>
        <h1 className={styles.title}>{quote.company_name}</h1>
        <span className={clsx(styles.statusBadge, styles[`status_${quote.status}`])}>
          {t(`business.quoteStatus.${quote.status}`)}
        </span>
      </div>

      <div className={styles.serviceTags}>
        {quote.service_types.map((type) => (
          <span key={type} className={styles.serviceTag}>
            {t(`business.serviceTypes.${type}`)}
          </span>
        ))}
      </div>

      <div className={styles.infoRow}>
        {quote.event_date && (
          <span className={styles.infoItem}>
            <Calendar size={15} strokeWidth={2} />
            {new Date(quote.event_date).toLocaleDateString('fr-FR')}
          </span>
        )}
        <span className={styles.infoItem}>
          <Users size={15} strokeWidth={2} />
          {t('business.participantCountValue', { count: quote.participant_count })}
        </span>
      </div>

      {quote.notes && <p className={styles.notes}>{quote.notes}</p>}

      {typeof quote.quoted_amount === 'number' && (
        <div className={styles.quoteBox}>
          <span>{t('business.quotedAmount')}</span>
          <strong>
            {quote.quoted_amount.toLocaleString('fr-FR')} {quote.currency}
          </strong>
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('business.participantsTitle')}</h2>

        {participants && participants.length > 0 && (
          <ul className={styles.participantList}>
            {participants.map((p) => (
              <li key={p.id} className={styles.participantRow}>
                <div>
                  <p className={styles.participantName}>{p.full_name}</p>
                  {p.email && <p className={styles.participantEmail}>{p.email}</p>}
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeParticipant(p.id)}
                  aria-label={t('business.removeParticipant')}
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAdd} className={styles.addForm}>
          <Input
            label={t('business.participantName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
            required
          />
          <Input
            label={t('business.participantEmailOptional')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {addError && <p className={styles.error}>{extractApiErrorMessage(addError, t('common.error'))}</p>}
          <Button type="submit" variant="secondary" disabled={isAdding || name.trim().length < 2}>
            <UserPlus size={16} strokeWidth={2} />
            {t('business.addParticipant')}
          </Button>
        </form>
      </section>
    </div>
  );
}

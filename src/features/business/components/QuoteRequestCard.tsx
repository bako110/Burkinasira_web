import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Users, Briefcase, MapPin, Check, X } from 'lucide-react';
import clsx from 'clsx';

import type { QuoteRequest, QuoteRequestStatus } from '../types';
import styles from './QuoteRequestCard.module.css';

/** Étape atteinte dans le parcours : envoyée → examen → devis → décision. */
const STEP_OF: Record<QuoteRequestStatus, number> = {
  submitted: 0,
  in_review: 1,
  quoted: 2,
  accepted: 3,
  declined: 3,
};

const STEP_KEYS = ['submitted', 'in_review', 'quoted', 'decision'] as const;

export function QuoteRequestCard({ quote }: { quote: QuoteRequest }) {
  const { t, i18n } = useTranslation();
  const visibleTags = quote.service_types.slice(0, 3);
  const extraCount = quote.service_types.length - visibleTags.length;
  const step = STEP_OF[quote.status];
  const declined = quote.status === 'declined';

  return (
    <Link to={`/business/quotes/${quote.id}`} className={styles.link}>
      <article className={clsx(styles.card, styles[`status_${quote.status}`])}>
        <header className={styles.header}>
          <span className={styles.iconWrap}>
            <Briefcase size={20} strokeWidth={1.75} />
          </span>
          <div className={styles.headerText}>
            <h3 className={styles.companyName}>{quote.company_name}</h3>
            <span className={styles.createdAt}>
              {new Date(quote.created_at).toLocaleDateString(i18n.language, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <span className={styles.statusBadge}>
            <span className={styles.statusDot} aria-hidden="true" />
            {t(`business.quoteStatus.${quote.status}`)}
          </span>
        </header>

        <div className={styles.serviceTags}>
          {visibleTags.map((type) => (
            <span key={type} className={styles.serviceTag}>
              {t(`business.serviceTypes.${type}`)}
            </span>
          ))}
          {extraCount > 0 && <span className={styles.serviceTag}>+{extraCount}</span>}
        </div>

        {/* Progression de la demande */}
        <ol className={styles.steps} aria-label={t('business.list.progress')}>
          {STEP_KEYS.map((key, i) => {
            const reached = i <= step;
            const isLast = i === STEP_KEYS.length - 1;
            return (
              <li key={key} className={clsx(styles.step, reached && styles.stepReached, i === step && styles.stepCurrent)}>
                <span className={styles.stepDot}>
                  {reached && i < step && <Check size={10} strokeWidth={3.5} />}
                  {isLast && reached && (declined ? <X size={10} strokeWidth={3.5} /> : <Check size={10} strokeWidth={3.5} />)}
                </span>
                <span className={styles.stepLabel}>{t(`business.list.step.${key}`)}</span>
              </li>
            );
          })}
        </ol>

        <div className={styles.metaRow}>
          {quote.event_date && (
            <span className={styles.metaItem}>
              <Calendar size={14} strokeWidth={2} />
              {new Date(quote.event_date).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          )}
          {quote.region && (
            <span className={styles.metaItem}>
              <MapPin size={14} strokeWidth={2} />
              {quote.region}
            </span>
          )}
          <span className={styles.metaItem}>
            <Users size={14} strokeWidth={2} />
            {t('business.participantCountValue', { count: quote.participant_count })}
          </span>
        </div>

        {typeof quote.quoted_amount === 'number' && (
          <div className={styles.amountBox}>
            <span className={styles.amountLabel}>{t('business.quotedAmount')}</span>
            <span className={styles.amountValue}>
              {quote.quoted_amount.toLocaleString('fr-FR')} <small>{quote.currency}</small>
            </span>
          </div>
        )}

      </article>
    </Link>
  );
}

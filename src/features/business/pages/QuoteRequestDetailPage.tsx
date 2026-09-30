import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  Users,
  MapPin,
  ArrowLeft,
  Trash2,
  UserPlus,
  Briefcase,
  Check,
  X,
  Hourglass,
  PartyPopper,
  Receipt,
  ThumbsUp,
  ThumbsDown,
  StickyNote,
} from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults, DetailBackButton, Reveal, ConfirmDialog } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useToastStore } from '../../../store/toast.store';
import { useQuoteRequestDetail } from '../hooks/useQuoteRequestDetail';
import { useEventParticipants } from '../hooks/useEventParticipants';
import { useAddEventParticipant } from '../hooks/useAddEventParticipant';
import { useRemoveEventParticipant } from '../hooks/useRemoveEventParticipant';
import { useQuoteInvoices } from '../hooks/useQuoteInvoices';
import { useRespondToQuote } from '../hooks/useRespondToQuote';
import type { EventParticipant, QuoteRequestStatus } from '../types';
import styles from './QuoteRequestDetailPage.module.css';

/** Étape atteinte dans le parcours : envoyée → examen → devis → décision. */
const STEP_OF: Record<QuoteRequestStatus, number> = { submitted: 0, in_review: 1, quoted: 2, accepted: 3, declined: 3 };
const STEP_KEYS = ['submitted', 'in_review', 'quoted', 'decision'] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function QuoteRequestDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);

  const { data: quote, isLoading, isError, refetch } = useQuoteRequestDetail(id);
  const { data: participants } = useEventParticipants(id);
  const { data: invoices } = useQuoteInvoices(id);
  const { mutate: addParticipant, isPending: isAdding, error: addError } = useAddEventParticipant(id ?? '');
  const { mutate: removeParticipant } = useRemoveEventParticipant(id ?? '');
  const { mutate: respond, isPending: isResponding } = useRespondToQuote(id ?? '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pendingRemove, setPendingRemove] = useState<EventParticipant | undefined>(undefined);
  const [pendingDecision, setPendingDecision] = useState<'accept' | 'decline' | undefined>(undefined);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addParticipant(
      { full_name: name.trim(), email: email.trim() || undefined },
      {
        onSuccess: () => {
          setName('');
          setEmail('');
        },
      },
    );
  }

  function confirmDecision() {
    if (!pendingDecision) return;
    respond(pendingDecision === 'accept', {
      onSuccess: () => {
        push({ variant: 'success', message: t('business.detail.responded') });
        setPendingDecision(undefined);
      },
      onError: (err) => {
        push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
        setPendingDecision(undefined);
      },
    });
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

  const step = STEP_OF[quote.status];
  const declined = quote.status === 'declined';
  const listed = participants ?? [];
  const progressPct = Math.min(100, Math.round((listed.length / Math.max(1, quote.participant_count)) * 100));
  const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso).toLocaleDateString(i18n.language, opts);
  const amountText =
    typeof quote.quoted_amount === 'number' ? `${quote.quoted_amount.toLocaleString('fr-FR')} ${quote.currency}` : '';

  return (
    <div className={styles.page}>
      <section className={clsx(styles.hero, styles[`status_${quote.status}`])}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/business" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <div className={styles.heroTop}>
            <span className={styles.kicker}>
              <Briefcase size={13} strokeWidth={2} />
              {t('nav.business')}
            </span>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} aria-hidden="true" />
              {t(`business.quoteStatus.${quote.status}`)}
            </span>
          </div>
          <h1 className={styles.title}>{quote.company_name}</h1>
          <p className={styles.sent}>
            {t('business.detail.sentOn', { date: formatDate(quote.created_at, { day: '2-digit', month: 'long', year: 'numeric' }) })}
          </p>

          <ol className={styles.steps} aria-label={t('business.list.progress')}>
            {STEP_KEYS.map((key, i) => {
              const reached = i <= step;
              const isLast = i === STEP_KEYS.length - 1;
              return (
                <li key={key} className={clsx(styles.step, reached && styles.stepReached, i === step && styles.stepCurrent)}>
                  <span className={styles.stepDot}>
                    {reached && i < step && <Check size={11} strokeWidth={3.5} />}
                    {isLast && reached && (declined ? <X size={11} strokeWidth={3.5} /> : <Check size={11} strokeWidth={3.5} />)}
                  </span>
                  <span className={styles.stepLabel}>{t(`business.list.step.${key}`)}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          {/* Bandeau d'état / décision */}
          {quote.status === 'quoted' && (
            <Reveal className={clsx(styles.banner, styles.bannerQuoted)}>
              <span className={styles.bannerIcon}>
                <Receipt size={22} strokeWidth={1.75} />
              </span>
              <div className={styles.bannerText}>
                <h2 className={styles.bannerTitle}>{t('business.detail.quotedTitle')}</h2>
                <p className={styles.bannerAmount}>{amountText}</p>
                <p className={styles.bannerHint}>{t('business.detail.quotedText')}</p>
              </div>
              <div className={styles.decision}>
                <button type="button" className={styles.acceptBtn} onClick={() => setPendingDecision('accept')} disabled={isResponding}>
                  <ThumbsUp size={16} strokeWidth={2} />
                  {t('business.detail.accept')}
                </button>
                <button type="button" className={styles.declineBtn} onClick={() => setPendingDecision('decline')} disabled={isResponding}>
                  <ThumbsDown size={16} strokeWidth={2} />
                  {t('business.detail.decline')}
                </button>
              </div>
            </Reveal>
          )}

          {(quote.status === 'submitted' || quote.status === 'in_review') && (
            <Reveal className={clsx(styles.banner, styles.bannerWaiting)}>
              <span className={styles.bannerIcon}>
                <Hourglass size={22} strokeWidth={1.75} />
              </span>
              <div className={styles.bannerText}>
                <h2 className={styles.bannerTitle}>{t(`business.detail.waiting.${quote.status}.title`)}</h2>
                <p className={styles.bannerHint}>{t(`business.detail.waiting.${quote.status}.text`)}</p>
              </div>
            </Reveal>
          )}

          {quote.status === 'accepted' && (
            <Reveal className={clsx(styles.banner, styles.bannerAccepted)}>
              <span className={styles.bannerIcon}>
                <PartyPopper size={22} strokeWidth={1.75} />
              </span>
              <div className={styles.bannerText}>
                <h2 className={styles.bannerTitle}>{t('business.detail.acceptedTitle')}</h2>
                {amountText && <p className={styles.bannerAmount}>{amountText}</p>}
                <p className={styles.bannerHint}>{t('business.detail.acceptedText')}</p>
              </div>
            </Reveal>
          )}

          {quote.status === 'declined' && (
            <Reveal className={clsx(styles.banner, styles.bannerDeclined)}>
              <span className={styles.bannerIcon}>
                <ThumbsDown size={22} strokeWidth={1.75} />
              </span>
              <div className={styles.bannerText}>
                <h2 className={styles.bannerTitle}>{t('business.detail.declinedTitle')}</h2>
                <p className={styles.bannerHint}>{t('business.detail.declinedText')}</p>
              </div>
              <button type="button" className={styles.newBtn} onClick={() => navigate('/business/new')}>
                {t('business.newQuoteButton')}
              </button>
            </Reveal>
          )}

          <Reveal as="section" delay={60} className={styles.card}>
            <h2 className={styles.cardTitle}>{t('business.serviceTypesLabel')}</h2>
            <div className={styles.serviceTags}>
              {quote.service_types.map((type) => (
                <span key={type} className={styles.serviceTag}>
                  {t(`business.serviceTypes.${type}`)}
                </span>
              ))}
            </div>
            {quote.notes && (
              <>
                <h3 className={styles.cardSubtitle}>
                  <StickyNote size={15} strokeWidth={2} />
                  {t('family.notesOptional')}
                </h3>
                <p className={styles.notes}>{quote.notes}</p>
              </>
            )}
          </Reveal>

          <Reveal as="section" delay={100} className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>{t('business.participantsTitle')}</h2>
              <span className={styles.progressLabel}>
                {t('business.detail.participantsProgress', { count: listed.length, total: quote.participant_count })}
              </span>
            </div>
            <div
              className={styles.progress}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>

            {listed.length === 0 ? (
              <p className={styles.emptyList}>{t('business.detail.participantsEmpty')}</p>
            ) : (
              <ul className={styles.participantList}>
                {listed.map((p) => (
                  <li key={p.id} className={styles.participantRow}>
                    <span className={styles.participantAvatar}>{initials(p.full_name)}</span>
                    <div className={styles.participantInfo}>
                      <p className={styles.participantName}>{p.full_name}</p>
                      {p.email && <p className={styles.participantEmail}>{p.email}</p>}
                    </div>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => setPendingRemove(p)}
                      aria-label={t('business.removeParticipant')}
                    >
                      <Trash2 size={15} strokeWidth={2} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={handleAdd} className={styles.addForm}>
              <label className={styles.field}>
                <span className={styles.label}>{t('business.participantName')}</span>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={2}
                  required
                  autoComplete="off"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t('business.participantEmailOptional')}</span>
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <button type="submit" className={styles.addBtn} disabled={isAdding || name.trim().length < 2}>
                {isAdding ? <Spinner size={16} /> : <UserPlus size={16} strokeWidth={2} />}
                {t('business.addParticipant')}
              </button>
              {addError && <p className={styles.error}>{extractApiErrorMessage(addError, t('common.error'))}</p>}
            </form>
          </Reveal>
        </div>

        <aside className={styles.sidebar}>
          <Reveal className={styles.card} delay={80}>
            <h2 className={styles.cardTitle}>{t('business.detail.eventTitle')}</h2>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <Users size={16} strokeWidth={2} />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>{t('business.participantCount')}</span>
                  <span className={styles.infoValue}>{quote.participant_count}</span>
                </span>
              </li>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <Calendar size={16} strokeWidth={2} />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>{t('business.form.dateLabel')}</span>
                  <span className={clsx(styles.infoValue, !quote.event_date && styles.muted)}>
                    {quote.event_date
                      ? formatDate(quote.event_date, { day: '2-digit', month: 'long', year: 'numeric' })
                      : t('business.form.notSet')}
                  </span>
                </span>
              </li>
              <li className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <MapPin size={16} strokeWidth={2} />
                </span>
                <span className={styles.infoText}>
                  <span className={styles.infoLabel}>{t('business.form.regionLabel')}</span>
                  <span className={clsx(styles.infoValue, !quote.region && styles.muted)}>
                    {quote.region ?? t('business.form.notSet')}
                  </span>
                </span>
              </li>
            </ul>
          </Reveal>

          {invoices && invoices.length > 0 && (
            <Reveal className={styles.card} delay={120}>
              <h2 className={styles.cardTitle}>{t('business.detail.invoicesTitle')}</h2>
              <ul className={styles.invoices}>
                {invoices.map((inv) => (
                  <li key={inv.id} className={clsx(styles.invoice, styles[`invoice_${inv.status}`])}>
                    <div className={styles.invoiceMain}>
                      <span className={styles.invoiceAmount}>
                        {inv.amount.toLocaleString('fr-FR')} <small>{inv.currency}</small>
                      </span>
                      <span className={styles.invoiceDue}>
                        {inv.due_date
                          ? t('business.detail.dueOn', { date: formatDate(inv.due_date, { day: '2-digit', month: 'short', year: 'numeric' }) })
                          : t('business.detail.noDue')}
                      </span>
                    </div>
                    <span className={styles.invoiceStatus}>{t(`business.detail.invoiceStatus.${inv.status}`)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </aside>
      </div>

      <ConfirmDialog
        open={Boolean(pendingRemove)}
        title={t('business.removeParticipantConfirmTitle')}
        message={t('business.removeParticipantConfirmMessage')}
        confirmLabel={t('business.removeParticipant')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onCancel={() => setPendingRemove(undefined)}
        onConfirm={() => {
          if (!pendingRemove) return;
          removeParticipant(pendingRemove.id, {
            onSuccess: () => setPendingRemove(undefined),
            onError: (err) => {
              push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) });
              setPendingRemove(undefined);
            },
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDecision)}
        title={pendingDecision === 'accept' ? t('business.detail.confirmAcceptTitle') : t('business.detail.confirmDeclineTitle')}
        message={
          pendingDecision === 'accept'
            ? t('business.detail.confirmAcceptMessage', { amount: amountText, company: quote.company_name })
            : t('business.detail.confirmDeclineMessage')
        }
        confirmLabel={pendingDecision === 'accept' ? t('business.detail.accept') : t('business.detail.decline')}
        cancelLabel={t('common.cancel')}
        variant={pendingDecision === 'accept' ? 'default' : 'danger'}
        onCancel={() => setPendingDecision(undefined)}
        onConfirm={confirmDecision}
      />
    </div>
  );
}

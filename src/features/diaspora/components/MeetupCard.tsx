import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Users, Check } from 'lucide-react';
import clsx from 'clsx';

import { useAuthStore } from '../../../store/auth.store';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useJoinMeetup } from '../hooks/useJoinMeetup';
import type { CommunityMeetup } from '../types';
import styles from './MeetupCard.module.css';

const MS_PER_DAY = 86_400_000;

function dayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_PER_DAY);
}

export function MeetupCard({ meetup }: { meetup: CommunityMeetup }) {
  const { t, i18n } = useTranslation();
  const requireAuth = useRequireAuth();
  const userId = useAuthStore((s) => s.user?.id);
  const { mutate, isPending } = useJoinMeetup();

  const when = new Date(meetup.scheduled_at);
  const daysUntil = dayNumber(when) - dayNumber(new Date());
  const cancelled = meetup.status === 'cancelled';
  const past = !cancelled && (meetup.status === 'completed' || daysUntil < 0);

  const badge = cancelled
    ? t('diaspora.hub.cancelled')
    : past
      ? t('diaspora.hub.past')
      : daysUntil === 0
        ? t('diaspora.hub.today')
        : t('diaspora.hub.inDays', { count: daysUntil });

  const alreadyJoined = Boolean(userId && meetup.participant_ids.includes(userId));
  const canJoin = !cancelled && !past;

  function handleJoin() {
    requireAuth(() => mutate(meetup.id), t('diaspora.joinMeetupRequiresAuth'));
  }

  return (
    <article className={clsx(styles.card, (past || cancelled) && styles.cardMuted)}>
      <div className={styles.top}>
        <span className={styles.dateBlock} aria-hidden="true">
          <span className={styles.dateDay}>{when.toLocaleDateString(i18n.language, { day: '2-digit' })}</span>
          <span className={styles.dateMonth}>{when.toLocaleDateString(i18n.language, { month: 'short' }).replace('.', '')}</span>
        </span>
        <span className={clsx(styles.badge, cancelled && styles.badgeCancelled, past && styles.badgePast)}>{badge}</span>
      </div>

      <h3 className={styles.title}>{meetup.title}</h3>
      {meetup.description && <p className={styles.description}>{meetup.description}</p>}

      <div className={styles.metaList}>
        <span className={styles.row}>
          <MapPin size={14} strokeWidth={2} />
          {meetup.region}
        </span>
        <span className={styles.row}>
          <Clock size={14} strokeWidth={2} />
          {when.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className={styles.footer}>
        <span className={styles.participantCount}>
          <Users size={14} strokeWidth={2} />
          {t('diaspora.participantCount', { count: meetup.participant_ids.length })}
        </span>
        {canJoin && (
          <button
            type="button"
            className={clsx(styles.joinBtn, alreadyJoined && styles.joinBtnDone)}
            onClick={handleJoin}
            disabled={isPending || alreadyJoined}
          >
            {alreadyJoined && <Check size={14} strokeWidth={3} />}
            {alreadyJoined ? t('diaspora.alreadyJoined') : t('diaspora.joinMeetup')}
          </button>
        )}
      </div>
    </article>
  );
}

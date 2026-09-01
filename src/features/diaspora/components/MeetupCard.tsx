import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Users } from 'lucide-react';

import { Card, Button } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useJoinMeetup } from '../hooks/useJoinMeetup';
import type { CommunityMeetup } from '../types';
import styles from './MeetupCard.module.css';

export function MeetupCard({ meetup }: { meetup: CommunityMeetup }) {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const userId = useAuthStore((s) => s.user?.id);
  const { mutate, isPending } = useJoinMeetup();

  const alreadyJoined = Boolean(userId && meetup.participant_ids.includes(userId));

  function handleJoin() {
    requireAuth(() => mutate(meetup.id), t('diaspora.joinMeetupRequiresAuth'));
  }

  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>{meetup.title}</h3>
      {meetup.description && <p className={styles.description}>{meetup.description}</p>}
      <div className={styles.row}>
        <MapPin size={14} strokeWidth={2} />
        <span>{meetup.region}</span>
      </div>
      <div className={styles.row}>
        <Calendar size={14} strokeWidth={2} />
        <span>{new Date(meetup.scheduled_at).toLocaleString('fr-FR')}</span>
      </div>
      <div className={styles.footer}>
        <span className={styles.participantCount}>
          <Users size={13} strokeWidth={2} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
          {t('diaspora.participantCount', { count: meetup.participant_ids.length })}
        </span>
        <Button
          size="sm"
          variant={alreadyJoined ? 'secondary' : 'primary'}
          onClick={handleJoin}
          disabled={isPending || alreadyJoined}
        >
          {alreadyJoined ? t('diaspora.alreadyJoined') : t('diaspora.joinMeetup')}
        </Button>
      </div>
    </Card>
  );
}

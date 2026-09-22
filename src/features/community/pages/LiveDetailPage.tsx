import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Radio, ArrowLeft, Square } from 'lucide-react';

import { Button, Spinner, EmptyResults, DetailBackButton, Avatar } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useLiveSession, useLiveToken, useEndLive } from '../hooks/useLive';
import { LiveRoom } from '../components/LiveRoom';
import styles from './LiveDetailPage.module.css';

export function LiveDetailPage() {
  const { t } = useTranslation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const push = useToastStore((s) => s.push);
  const userId = useAuthStore((s) => s.user?.id);

  const { data: session, isLoading, isError, refetch } = useLiveSession(sessionId);
  const isHost = Boolean(userId && session && userId === session.host_id);
  const isLive = session?.status === 'live';

  const { data: liveToken, isLoading: isLoadingToken, isError: isTokenError } = useLiveToken(isLive ? sessionId : undefined);
  const { mutate: end, isPending: isEnding } = useEndLive(sessionId ?? '');

  function handleEnd() {
    end(undefined, {
      onSuccess: () => push({ variant: 'success', message: t('community.liveEnded') }),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('community.liveNotFound')}
          text={t('destinations.detailNotFoundText')}
          onRetry={() => refetch()}
        />
        <Button variant="ghost" onClick={() => navigate('/community')}>
          <ArrowLeft size={16} strokeWidth={2} />
          {t('community.tabGroups')}
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <DetailBackButton fallbackTo="/community" />

      <div className={styles.header}>
        <Avatar src={session.host_avatar_url} name={session.host_name ?? ''} size={44} />
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{session.title}</h1>
            {isLive ? (
              <span className={styles.liveBadge}>
                <Radio size={12} strokeWidth={2.5} />
                {t('community.liveBadge')}
              </span>
            ) : (
              <span className={styles.endedBadge}>{t('community.liveEndedBadge')}</span>
            )}
          </div>
          <span className={styles.hostName}>{session.host_name}</span>
          {session.description && <p className={styles.description}>{session.description}</p>}
        </div>

        {isHost && isLive && (
          <Button variant="danger" onClick={handleEnd} disabled={isEnding}>
            <Square size={15} strokeWidth={2} />
            {isEnding ? t('common.loading') : t('community.endLive')}
          </Button>
        )}
      </div>

      {!isLive && (
        <EmptyResults variant="empty" title={t('community.liveEndedBadge')} text={t('community.liveEndedText')} />
      )}

      {isLive && isLoadingToken && (
        <div className={styles.center}>
          <Spinner size={28} />
        </div>
      )}

      {isLive && isTokenError && (
        <EmptyResults variant="error" title={t('community.liveTokenError')} onRetry={() => refetch()} />
      )}

      {isLive && liveToken && <LiveRoom liveToken={liveToken} isHost={isHost} />}
    </div>
  );
}

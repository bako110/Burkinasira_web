import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusCircle } from 'lucide-react';

import { Button, Reveal, EmptyResults, CardSkeleton, ListingHero, Tabs } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useDiasporaContent } from '../hooks/useDiasporaContent';
import { useMeetups } from '../hooks/useMeetups';
import { DiasporaContentCard } from '../components/DiasporaContentCard';
import { DiasporaContentFilters } from '../components/DiasporaContentFilters';
import { MeetupCard } from '../components/MeetupCard';
import { CreateMeetupModal } from '../components/CreateMeetupModal';
import type { DiasporaContentType } from '../types';
import styles from './DiasporaHubPage.module.css';

export function DiasporaHubPage() {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const [tab, setTab] = useState<'content' | 'meetups'>('content');
  const [type, setType] = useState<DiasporaContentType | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);

  const contentQuery = useDiasporaContent({ type });
  const meetupsQuery = useMeetups();

  return (
    <div className={styles.page}>
      <ListingHero
        title={t('diaspora.title')}
        subtitle={t('diaspora.subtitle')}
        searchPlaceholder={t('diaspora.searchPlaceholder')}
        searchLabel={t('common.search')}
        searchButtonLabel={t('common.search')}
        query=""
        onQueryChange={() => {}}
        onSubmit={() => {}}
      />

      <div className={styles.body}>
        <Tabs
          items={[
            { key: 'content', label: t('diaspora.tabContent') },
            { key: 'meetups', label: t('diaspora.tabMeetups') },
          ]}
          active={tab}
          onChange={(key) => setTab(key as 'content' | 'meetups')}
        />

        {tab === 'content' && (
          <>
            <DiasporaContentFilters active={type} onChange={setType} />

            {contentQuery.isLoading && (
              <div className={styles.grid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {!contentQuery.isLoading && contentQuery.isError && (
              <EmptyResults variant="error" onRetry={() => contentQuery.refetch()} />
            )}

            {!contentQuery.isLoading && !contentQuery.isError && (contentQuery.data?.length ?? 0) === 0 && (
              <EmptyResults variant="empty" title={t('diaspora.empty')} text={t('explore.emptyText')} onReset={() => setType(undefined)} />
            )}

            {!contentQuery.isLoading && !contentQuery.isError && (contentQuery.data?.length ?? 0) > 0 && (
              <div className={styles.grid}>
                {contentQuery.data!.map((content, i) => (
                  <Reveal key={content.id} delay={Math.min(i, 8) * 50}>
                    <DiasporaContentCard content={content} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'meetups' && (
          <>
            <div className={styles.actionsRow}>
              <Button
                variant="secondary"
                onClick={() => requireAuth(() => setCreateOpen(true), t('diaspora.createMeetupRequiresAuth'))}
              >
                <PlusCircle size={16} strokeWidth={2} />
                {t('diaspora.organizeMeetup')}
              </Button>
            </div>

            {meetupsQuery.isLoading && (
              <div className={styles.meetupGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {!meetupsQuery.isLoading && meetupsQuery.isError && (
              <EmptyResults variant="error" onRetry={() => meetupsQuery.refetch()} />
            )}

            {!meetupsQuery.isLoading && !meetupsQuery.isError && (meetupsQuery.data?.length ?? 0) === 0 && (
              <EmptyResults variant="empty" title={t('diaspora.emptyMeetups')} text={t('explore.emptyText')} />
            )}

            {!meetupsQuery.isLoading && !meetupsQuery.isError && (meetupsQuery.data?.length ?? 0) > 0 && (
              <div className={styles.meetupGrid}>
                {meetupsQuery.data!.map((meetup, i) => (
                  <Reveal key={meetup.id} delay={Math.min(i, 8) * 50}>
                    <MeetupCard meetup={meetup} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateMeetupModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

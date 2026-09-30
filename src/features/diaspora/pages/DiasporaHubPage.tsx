import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { PlusCircle, LayoutGrid, Sparkles, CalendarHeart } from 'lucide-react';
import clsx from 'clsx';

import { Reveal, EmptyResults, CardSkeleton } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue';
import { useDiasporaContent } from '../hooks/useDiasporaContent';
import { useMeetups } from '../hooks/useMeetups';
import { DiasporaHero } from '../components/DiasporaHero';
import { DiasporaContentCard } from '../components/DiasporaContentCard';
import { MeetupCard } from '../components/MeetupCard';
import { CreateMeetupModal } from '../components/CreateMeetupModal';
import { TYPE_META, TYPE_ORDER } from '../components/typeMeta';
import type { DiasporaContentType } from '../types';
import styles from './DiasporaHubPage.module.css';

type Tab = 'content' | 'meetups';

export function DiasporaHubPage() {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('content');
  const [type, setType] = useState<DiasporaContentType | undefined>(undefined);
  const [createOpen, setCreateOpen] = useState(false);

  const urlQuery = searchParams.get('q') ?? '';
  const [queryInput, setQueryInput] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(queryInput);

  useEffect(() => setQueryInput(urlQuery), [urlQuery]);

  useEffect(() => {
    if (debouncedQuery === urlQuery) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedQuery) next.set('q', debouncedQuery);
      else next.delete('q');
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function applySearch() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (queryInput) next.set('q', queryInput);
      else next.delete('q');
      return next;
    });
  }

  // On charge tout le contenu (selon la recherche) une seule fois : le filtre par thème et les compteurs se calculent côté client.
  const contentQuery = useDiasporaContent({ q: urlQuery || undefined });
  const meetupsQuery = useMeetups();

  const allContent = useMemo(() => contentQuery.data ?? [], [contentQuery.data]);

  const counts = useMemo(() => {
    const c = new Map<DiasporaContentType, number>();
    allContent.forEach((item) => c.set(item.type, (c.get(item.type) ?? 0) + 1));
    return c;
  }, [allContent]);

  const visibleContent = useMemo(
    () => (type ? allContent.filter((item) => item.type === type) : allContent),
    [allContent, type],
  );

  // Rencontres : à venir d'abord (les plus proches en premier), puis les passées.
  const meetups = useMemo(() => {
    const now = Date.now();
    return [...(meetupsQuery.data ?? [])].sort((a, b) => {
      const ta = new Date(a.scheduled_at).getTime();
      const tb = new Date(b.scheduled_at).getTime();
      const aPast = ta < now;
      const bPast = tb < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? tb - ta : ta - tb;
    });
  }, [meetupsQuery.data]);

  const upcomingCount = meetups.filter((m) => m.status === 'planned' && new Date(m.scheduled_at).getTime() >= Date.now()).length;
  const contentReady = !contentQuery.isLoading && !contentQuery.isError;
  const meetupsReady = !meetupsQuery.isLoading && !meetupsQuery.isError;

  return (
    <div className={styles.page}>
      <DiasporaHero
        query={queryInput}
        onQueryChange={setQueryInput}
        onSubmit={applySearch}
        stats={
          <>
            {contentReady && (
              <span className={styles.statChip}>
                <Sparkles size={14} strokeWidth={2} />
                {t('diaspora.hub.contentCount', { count: allContent.length })}
              </span>
            )}
            {meetupsReady && upcomingCount > 0 && (
              <span className={styles.statChip}>
                <CalendarHeart size={14} strokeWidth={2} />
                {t('diaspora.hub.upcomingCount', { count: upcomingCount })}
              </span>
            )}
          </>
        }
      />

      <div className={styles.container}>
        {/* Onglets */}
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'content'}
            className={clsx(styles.tab, tab === 'content' && styles.tabActive)}
            onClick={() => setTab('content')}
          >
            {t('diaspora.tabContent')}
            {contentReady && <span className={styles.tabCount}>{allContent.length}</span>}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'meetups'}
            className={clsx(styles.tab, tab === 'meetups' && styles.tabActive)}
            onClick={() => setTab('meetups')}
          >
            {t('diaspora.tabMeetups')}
            {meetupsReady && <span className={styles.tabCount}>{meetups.length}</span>}
          </button>
        </div>

        {tab === 'content' && (
          <>
            {/* Tuiles de thèmes : filtre + compteurs */}
            <div className={styles.tiles} role="group" aria-label={t('explore.filtersLabel')}>
              <button
                type="button"
                className={clsx(styles.tile, !type && styles.tileActive)}
                data-tone="orange"
                aria-pressed={!type}
                onClick={() => setType(undefined)}
              >
                <span className={styles.tileIcon}>
                  <LayoutGrid size={20} strokeWidth={1.75} />
                </span>
                <span className={styles.tileLabel}>{t('diaspora.filters.all')}</span>
                <span className={styles.tileCount}>{allContent.length}</span>
              </button>
              {TYPE_ORDER.map((value) => {
                const { Icon, tone } = TYPE_META[value];
                const count = counts.get(value) ?? 0;
                const active = type === value;
                return (
                  <button
                    key={value}
                    type="button"
                    className={clsx(styles.tile, active && styles.tileActive)}
                    data-tone={tone}
                    aria-pressed={active}
                    onClick={() => setType(active ? undefined : value)}
                    disabled={contentReady && count === 0}
                  >
                    <span className={styles.tileIcon}>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <span className={styles.tileLabel}>{t(`diaspora.types.${value}`)}</span>
                    <span className={styles.tileCount}>{count}</span>
                  </button>
                );
              })}
            </div>

            {contentQuery.isLoading && (
              <div className={styles.grid}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {!contentQuery.isLoading && contentQuery.isError && (
              <EmptyResults variant="error" onRetry={() => contentQuery.refetch()} />
            )}

            {contentReady && visibleContent.length === 0 && (
              <EmptyResults
                variant="empty"
                title={t('diaspora.empty')}
                text={t('explore.emptyText')}
                onReset={() => setType(undefined)}
              />
            )}

            {contentReady && visibleContent.length > 0 && (
              <div key={type ?? 'all'} className={styles.grid}>
                {visibleContent.map((content, i) => (
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
            <div className={styles.cta}>
              <span className={styles.ctaIcon}>
                <CalendarHeart size={24} strokeWidth={1.75} />
              </span>
              <div className={styles.ctaText}>
                <h2 className={styles.ctaTitle}>{t('diaspora.hub.meetupsTitle')}</h2>
                <p className={styles.ctaSubtitle}>{t('diaspora.hub.meetupsSubtitle')}</p>
              </div>
              <button
                type="button"
                className={styles.ctaBtn}
                onClick={() => requireAuth(() => setCreateOpen(true), t('diaspora.createMeetupRequiresAuth'))}
              >
                <PlusCircle size={17} strokeWidth={2} />
                {t('diaspora.organizeMeetup')}
              </button>
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

            {meetupsReady && meetups.length === 0 && (
              <EmptyResults variant="empty" title={t('diaspora.emptyMeetups')} text={t('explore.emptyText')} />
            )}

            {meetupsReady && meetups.length > 0 && (
              <div className={styles.meetupGrid}>
                {meetups.map((meetup, i) => (
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

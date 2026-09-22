import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Users, Image, HelpCircle, Heart, UsersRound, Handshake, Radio } from 'lucide-react';
import clsx from 'clsx';

import {
  Button,
  Spinner,
  EmptyResults,
  RegionProvinceFilter,
  Reveal,
  DetailBackButton,
  ConfirmDialog,
} from '../../../shared/ui';
import { useExperiences } from '../../experiences/hooks/useExperiences';
import { ExperienceCard } from '../../experiences/components/ExperienceCard';
import type { ExperienceType } from '../../experiences/types';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useAuthStore } from '../../../store/auth.store';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { usePosts } from '../hooks/usePosts';
import { useQuestions } from '../hooks/useQuestions';
import { useMyFavoriteLists, useDeleteFavoriteList } from '../hooks/useFavoriteLists';
import { useGroups } from '../hooks/useGroups';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { QuestionCard } from '../components/QuestionCard';
import { AskQuestionModal } from '../components/AskQuestionModal';
import { QuestionDetailModal } from '../components/QuestionDetailModal';
import { FavoriteListCard } from '../components/FavoriteListCard';
import { CreateFavoriteListModal } from '../components/CreateFavoriteListModal';
import { GroupCard } from '../components/GroupCard';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { LiveCard } from '../components/LiveCard';
import { StartLiveModal } from '../components/StartLiveModal';
import { useLiveSessions } from '../hooks/useLive';
import { GROUP_THEMES, type Post, type Question } from '../types';
import styles from './CommunityPage.module.css';

type Tab = 'posts' | 'questions' | 'favorites' | 'groups' | 'localMeet' | 'live';

/** Types d'expériences relevant du tourisme communautaire (touriste ↔ habitant). */
const LOCAL_MEET_TYPES: ExperienceType[] = [
  'rencontre_habitant',
  'visite_village',
  'hebergement_habitant',
  'decouverte_metier',
  'agritourisme',
  'rencontre_artiste',
];

const POSTS_PAGE_SIZE = 12;

export function CommunityPage() {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const push = useToastStore((s) => s.push);
  const [tab, setTab] = useState<Tab>('posts');

  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postsPage, setPostsPage] = useState(1);
  const [accumulatedPosts, setAccumulatedPosts] = useState<Post[]>([]);
  const { data: postsData, isLoading: isLoadingPosts, isFetching: isFetchingPosts } = usePosts({
    page: postsPage,
    page_size: POSTS_PAGE_SIZE,
  });

  useEffect(() => {
    if (!postsData) return;
    setAccumulatedPosts((prev) => (postsPage === 1 ? postsData.items : [...prev, ...postsData.items]));
  }, [postsData, postsPage]);

  const postsTotal = postsData?.total ?? 0;
  const hasMorePosts = accumulatedPosts.length > 0 && accumulatedPosts.length < postsTotal;

  const [askOpen, setAskOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const { data: questions, isLoading: isLoadingQuestions } = useQuestions();

  const [createListOpen, setCreateListOpen] = useState(false);
  const [pendingDeleteListId, setPendingDeleteListId] = useState<string | undefined>(undefined);
  const { data: favoriteLists, isLoading: isLoadingLists } = useMyFavoriteLists();
  const { mutate: deleteList } = useDeleteFavoriteList();

  const [startLiveOpen, setStartLiveOpen] = useState(false);
  const { data: liveSessions, isLoading: isLoadingLive } = useLiveSessions();

  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupRegion, setGroupRegion] = useState<string | undefined>(undefined);
  const [groupProvince, setGroupProvince] = useState<string | undefined>(undefined);
  const [groupTheme, setGroupTheme] = useState('');
  const { data: groups, isLoading: isLoadingGroups } = useGroups(
    true,
    groupRegion,
    groupTheme || undefined,
    groupProvince,
  );

  // Rencontres locales : on récupère les expériences et on ne garde que celles
  // qui relèvent du tourisme communautaire (contact direct avec des habitants).
  const { data: experiencesData, isLoading: isLoadingLocalMeet } = useExperiences();
  const localMeetExperiences = useMemo(
    () => (experiencesData?.items ?? []).filter((e) => LOCAL_MEET_TYPES.includes(e.type)),
    [experiencesData],
  );

  function applyGroupRegionProvince(regionValue: string | undefined, provinceValue: string | undefined) {
    setGroupRegion(regionValue);
    setGroupProvince(provinceValue);
  }

  function handleConfirmDeleteList() {
    if (!pendingDeleteListId) return;
    deleteList(pendingDeleteListId, {
      onSuccess: () => setPendingDeleteListId(undefined),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Users size={28} strokeWidth={1.75} />
          </span>
          <h1 className={styles.heroTitle}>{t('community.title')}</h1>
          <p className={styles.heroSubtitle}>{t('community.subtitle')}</p>
        </div>
      </section>

      <div className={styles.tabBar}>
        <div className={styles.tabBarInner}>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'posts' && styles.tabBtnActive)}
            onClick={() => setTab('posts')}
          >
            <Image size={16} strokeWidth={2} />
            {t('community.tabPostsFeed')}
          </button>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'questions' && styles.tabBtnActive)}
            onClick={() => setTab('questions')}
          >
            <HelpCircle size={16} strokeWidth={2} />
            {t('community.tabQuestions')}
          </button>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'favorites' && styles.tabBtnActive)}
            onClick={() => setTab('favorites')}
          >
            <Heart size={16} strokeWidth={2} />
            {t('community.tabFavorites')}
          </button>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'groups' && styles.tabBtnActive)}
            onClick={() => setTab('groups')}
          >
            <UsersRound size={16} strokeWidth={2} />
            {t('community.tabGroups')}
          </button>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'localMeet' && styles.tabBtnActive)}
            onClick={() => setTab('localMeet')}
          >
            <Handshake size={16} strokeWidth={2} />
            {t('experiences.localMeetTab')}
          </button>
          <button
            type="button"
            className={clsx(styles.tabBtn, tab === 'live' && styles.tabBtnActive)}
            onClick={() => setTab('live')}
          >
            <Radio size={16} strokeWidth={2} />
            {t('community.tabLive')}
            {(liveSessions?.length ?? 0) > 0 && <span className={styles.liveDot} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {tab === 'posts' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <Button onClick={() => requireAuth(() => setCreatePostOpen(true), t('community.postRequiresAuth'))}>
                <Plus size={16} strokeWidth={2} />
                {t('community.createPost')}
              </Button>
            </div>

            {isLoadingPosts && (
              <div className={styles.center}>
                <Spinner size={24} />
              </div>
            )}

            {!isLoadingPosts && accumulatedPosts.length === 0 && (
              <EmptyResults variant="empty" title={t('community.noPosts')} text={t('community.noPostsText')} />
            )}

            {!isLoadingPosts && accumulatedPosts.length > 0 && (
              <>
                <div className={styles.postList}>
                  {accumulatedPosts.map((post, i) => (
                    <Reveal key={post.id} delay={(i % POSTS_PAGE_SIZE) * 50}>
                      <PostCard post={post} />
                    </Reveal>
                  ))}
                </div>

                {hasMorePosts && (
                  <div className={styles.loadMoreRow}>
                    <Button
                      variant="secondary"
                      onClick={() => setPostsPage((p) => p + 1)}
                      disabled={isFetchingPosts}
                    >
                      {isFetchingPosts ? t('common.loading') : t('explore.loadMore')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === 'questions' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <Button
                onClick={() => requireAuth(() => setAskOpen(true), t('community.askRequiresAuth'))}
              >
                <Plus size={16} strokeWidth={2} />
                {t('community.askQuestion')}
              </Button>
            </div>

            {isLoadingQuestions && (
              <div className={styles.center}>
                <Spinner size={24} />
              </div>
            )}

            {!isLoadingQuestions && (!questions || questions.length === 0) && (
              <EmptyResults variant="empty" title={t('community.noQuestions')} text={t('community.noQuestionsText')} />
            )}

            {!isLoadingQuestions && questions && questions.length > 0 && (
              <div className={styles.list}>
                {questions.map((question, i) => (
                  <Reveal key={question.id} delay={i * 50}>
                    <QuestionCard question={question} onClick={() => setActiveQuestion(question)} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'favorites' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <Button
                variant="secondary"
                onClick={() => requireAuth(() => setCreateListOpen(true), t('community.createListRequiresAuth'))}
              >
                <Plus size={16} strokeWidth={2} />
                {t('community.createList')}
              </Button>
            </div>

            {!isAuthenticated && (
              <EmptyResults
                variant="empty"
                title={t('community.listsRequireAuthTitle')}
                text={t('community.createListRequiresAuth')}
              />
            )}

            {isAuthenticated && isLoadingLists && (
              <div className={styles.center}>
                <Spinner size={24} />
              </div>
            )}

            {isAuthenticated && !isLoadingLists && (!favoriteLists || favoriteLists.length === 0) && (
              <EmptyResults variant="empty" title={t('community.noLists')} text={t('community.noListsText')} />
            )}

            {isAuthenticated && !isLoadingLists && favoriteLists && favoriteLists.length > 0 && (
              <div className={styles.grid}>
                {favoriteLists.map((list, i) => (
                  <Reveal key={list.id} delay={i * 60}>
                    <FavoriteListCard list={list} onDelete={setPendingDeleteListId} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'groups' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <div className={styles.filterRow}>
                <RegionProvinceFilter
                  region={groupRegion}
                  province={groupProvince}
                  onChange={applyGroupRegionProvince}
                  showProvince
                />
                <select
                  className={styles.filterSelect}
                  value={groupTheme}
                  onChange={(e) => setGroupTheme(e.target.value)}
                  aria-label={t('community.themeLabel')}
                >
                  <option value="">{t('community.allThemes')}</option>
                  {GROUP_THEMES.map((th) => (
                    <option key={th} value={th}>
                      {t(`community.themes.${th}`)}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="secondary"
                onClick={() => requireAuth(() => setCreateGroupOpen(true), t('community.createGroupRequiresAuth'))}
              >
                <Plus size={16} strokeWidth={2} />
                {t('community.createGroup')}
              </Button>
            </div>

            {isLoadingGroups && (
              <div className={styles.center}>
                <Spinner size={24} />
              </div>
            )}

            {!isLoadingGroups && (!groups || groups.length === 0) && (
              <EmptyResults variant="empty" title={t('community.noGroups')} text={t('community.noGroupsText')} />
            )}

            {!isLoadingGroups && groups && groups.length > 0 && (
              <div className={styles.grid}>
                {groups.map((group, i) => (
                  <Reveal key={group.id} delay={i * 60}>
                    <GroupCard group={group} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'localMeet' && (
          <div className={styles.tabContent}>
            <div className={styles.localMeetIntro}>
              <h2 className={styles.localMeetTitle}>{t('experiences.localMeetTitle')}</h2>
              <p className={styles.localMeetText}>{t('experiences.localMeetText')}</p>
            </div>

            {isLoadingLocalMeet && (
              <div className={styles.center}>
                <Spinner size={24} />
              </div>
            )}

            {!isLoadingLocalMeet && localMeetExperiences.length === 0 && (
              <EmptyResults variant="empty" title={t('experiences.localMeetEmpty')} />
            )}

            {!isLoadingLocalMeet && localMeetExperiences.length > 0 && (
              <>
                <div className={styles.grid}>
                  {localMeetExperiences.map((experience, i) => (
                    <Reveal key={experience.id} delay={i * 60}>
                      <ExperienceCard experience={experience} />
                    </Reveal>
                  ))}
                </div>
                <div className={styles.loadMoreRow}>
                  <Link to="/experiences" className={styles.seeAllLink}>
                    {t('experiences.seeAllExperiences')}
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'live' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <Button
                variant="secondary"
                onClick={() => requireAuth(() => setStartLiveOpen(true), t('community.startLiveRequiresAuth'))}
              >
                <Radio size={16} strokeWidth={2} />
                {t('community.startLiveCta')}
              </Button>
            </div>

            {isLoadingLive && (
              <div className={styles.center}>
                <Spinner size={24} />
              </div>
            )}

            {!isLoadingLive && (!liveSessions || liveSessions.length === 0) && (
              <EmptyResults variant="empty" title={t('community.noLive')} text={t('community.noLiveText')} />
            )}

            {!isLoadingLive && liveSessions && liveSessions.length > 0 && (
              <div className={styles.grid}>
                {liveSessions.map((session, i) => (
                  <Reveal key={session.id} delay={i * 60}>
                    <LiveCard session={session} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CreatePostModal open={createPostOpen} onClose={() => setCreatePostOpen(false)} />
      <StartLiveModal open={startLiveOpen} onClose={() => setStartLiveOpen(false)} />
      <AskQuestionModal open={askOpen} onClose={() => setAskOpen(false)} />
      <QuestionDetailModal question={activeQuestion} onClose={() => setActiveQuestion(null)} />
      <CreateFavoriteListModal open={createListOpen} onClose={() => setCreateListOpen(false)} />
      <CreateGroupModal open={createGroupOpen} onClose={() => setCreateGroupOpen(false)} />

      <ConfirmDialog
        open={Boolean(pendingDeleteListId)}
        title={t('community.deleteListConfirmTitle')}
        message={t('community.deleteListConfirmMessage')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        onCancel={() => setPendingDeleteListId(undefined)}
        onConfirm={handleConfirmDeleteList}
      />
    </div>
  );
}

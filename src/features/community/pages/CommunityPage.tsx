import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users, Image, HelpCircle, Heart, UsersRound } from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults, RegionProvinceFilter } from '../../../shared/ui';
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
import { GROUP_THEMES, type Post, type Question } from '../types';
import styles from './CommunityPage.module.css';

type Tab = 'posts' | 'questions' | 'favorites' | 'groups';

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
  const { data: favoriteLists, isLoading: isLoadingLists } = useMyFavoriteLists();
  const { mutate: deleteList } = useDeleteFavoriteList();

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

  function applyGroupRegionProvince(regionValue: string | undefined, provinceValue: string | undefined) {
    setGroupRegion(regionValue);
    setGroupProvince(provinceValue);
  }

  function handleDeleteList(id: string) {
    deleteList(id, {
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Users size={28} strokeWidth={1.75} />
          </span>
          <h1 className={styles.heroTitle}>{t('community.title')}</h1>
          <p className={styles.heroSubtitle}>{t('community.subtitle')}</p>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.navGrid}>
          <button
            type="button"
            className={clsx(styles.navCard, tab === 'posts' && styles.navCardActive)}
            onClick={() => setTab('posts')}
          >
            <span className={clsx(styles.navIcon, styles.navIconPosts)}>
              <Image size={20} strokeWidth={1.75} />
            </span>
            <span className={styles.navText}>
              <span className={styles.navLabel}>{t('community.tabPostsFeed')}</span>
              <span className={styles.navHint}>{t('community.navHintPosts')}</span>
            </span>
          </button>
          <button
            type="button"
            className={clsx(styles.navCard, tab === 'questions' && styles.navCardActive)}
            onClick={() => setTab('questions')}
          >
            <span className={clsx(styles.navIcon, styles.navIconQuestions)}>
              <HelpCircle size={20} strokeWidth={1.75} />
            </span>
            <span className={styles.navText}>
              <span className={styles.navLabel}>{t('community.tabQuestions')}</span>
              <span className={styles.navHint}>{t('community.navHintQuestions')}</span>
            </span>
          </button>
          <button
            type="button"
            className={clsx(styles.navCard, tab === 'favorites' && styles.navCardActive)}
            onClick={() => setTab('favorites')}
          >
            <span className={clsx(styles.navIcon, styles.navIconFavorites)}>
              <Heart size={20} strokeWidth={1.75} />
            </span>
            <span className={styles.navText}>
              <span className={styles.navLabel}>{t('community.tabFavorites')}</span>
              <span className={styles.navHint}>{t('community.navHintFavorites')}</span>
            </span>
          </button>
          <button
            type="button"
            className={clsx(styles.navCard, tab === 'groups' && styles.navCardActive)}
            onClick={() => setTab('groups')}
          >
            <span className={clsx(styles.navIcon, styles.navIconGroups)}>
              <UsersRound size={20} strokeWidth={1.75} />
            </span>
            <span className={styles.navText}>
              <span className={styles.navLabel}>{t('community.tabGroups')}</span>
              <span className={styles.navHint}>{t('community.navHintGroups')}</span>
            </span>
          </button>
        </div>

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
                  {accumulatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
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
                {questions.map((question) => (
                  <QuestionCard key={question.id} question={question} onClick={() => setActiveQuestion(question)} />
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
                {favoriteLists.map((list) => (
                  <FavoriteListCard key={list.id} list={list} onDelete={handleDeleteList} />
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
                {groups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CreatePostModal open={createPostOpen} onClose={() => setCreatePostOpen(false)} />
      <AskQuestionModal open={askOpen} onClose={() => setAskOpen(false)} />
      <QuestionDetailModal question={activeQuestion} onClose={() => setActiveQuestion(null)} />
      <CreateFavoriteListModal open={createListOpen} onClose={() => setCreateListOpen(false)} />
      <CreateGroupModal open={createGroupOpen} onClose={() => setCreateGroupOpen(false)} />
    </div>
  );
}

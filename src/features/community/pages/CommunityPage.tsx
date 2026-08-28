import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Users } from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useAuthStore } from '../../../store/auth.store';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useQuestions } from '../hooks/useQuestions';
import { useMyFavoriteLists, useDeleteFavoriteList } from '../hooks/useFavoriteLists';
import { useGroups } from '../hooks/useGroups';
import { QuestionCard } from '../components/QuestionCard';
import { AskQuestionModal } from '../components/AskQuestionModal';
import { QuestionDetailModal } from '../components/QuestionDetailModal';
import { FavoriteListCard } from '../components/FavoriteListCard';
import { CreateFavoriteListModal } from '../components/CreateFavoriteListModal';
import { GroupCard } from '../components/GroupCard';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { GROUP_THEMES, type Question } from '../types';
import { BURKINA_REGIONS } from '../../weather/types';
import styles from './CommunityPage.module.css';

type Tab = 'questions' | 'favorites' | 'groups';

export function CommunityPage() {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const push = useToastStore((s) => s.push);
  const [tab, setTab] = useState<Tab>('questions');

  const [askOpen, setAskOpen] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const { data: questions, isLoading: isLoadingQuestions } = useQuestions();

  const [createListOpen, setCreateListOpen] = useState(false);
  const { data: favoriteLists, isLoading: isLoadingLists } = useMyFavoriteLists();
  const { mutate: deleteList } = useDeleteFavoriteList();

  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [groupRegion, setGroupRegion] = useState('');
  const [groupTheme, setGroupTheme] = useState('');
  const { data: groups, isLoading: isLoadingGroups } = useGroups(
    true,
    groupRegion || undefined,
    groupTheme || undefined,
  );

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
        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'questions' && styles.tabActive)}
            onClick={() => setTab('questions')}
          >
            {t('community.tabQuestions')}
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'favorites' && styles.tabActive)}
            onClick={() => setTab('favorites')}
          >
            {t('community.tabFavorites')}
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'groups' && styles.tabActive)}
            onClick={() => setTab('groups')}
          >
            {t('community.tabGroups')}
          </button>
        </div>

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
                <select
                  className={styles.filterSelect}
                  value={groupRegion}
                  onChange={(e) => setGroupRegion(e.target.value)}
                  aria-label={t('community.regionLabel')}
                >
                  <option value="">{t('community.allRegions')}</option>
                  {BURKINA_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
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

      <AskQuestionModal open={askOpen} onClose={() => setAskOpen(false)} />
      <QuestionDetailModal question={activeQuestion} onClose={() => setActiveQuestion(null)} />
      <CreateFavoriteListModal open={createListOpen} onClose={() => setCreateListOpen(false)} />
      <CreateGroupModal open={createGroupOpen} onClose={() => setCreateGroupOpen(false)} />
    </div>
  );
}

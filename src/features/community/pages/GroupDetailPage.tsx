import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Lock, ArrowLeft, Plus, MapPin, Tag } from 'lucide-react';
import clsx from 'clsx';

import { Button, Spinner, EmptyResults, DetailBackButton, Avatar } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useAuthStore } from '../../../store/auth.store';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { ChatWindow } from '../../messaging/components/ChatWindow';
import { useGroupDetail, useJoinGroup, useLeaveGroup } from '../hooks/useGroups';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import styles from './GroupDetailPage.module.css';

type Tab = 'chat' | 'posts' | 'members';

export function GroupDetailPage() {
  const { t } = useTranslation();
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const requireAuth = useRequireAuth();
  const push = useToastStore((s) => s.push);
  const userId = useAuthStore((s) => s.user?.id);
  const [tab, setTab] = useState<Tab>('chat');
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const { data: group, isLoading, isError, refetch } = useGroupDetail(groupId);
  const { mutate: join, isPending: isJoining } = useJoinGroup(groupId);
  const { mutate: leave, isPending: isLeaving } = useLeaveGroup(groupId ?? '');
  const { data: postsData, isLoading: isLoadingPosts } = usePosts({ group_id: groupId, page_size: 30 });

  if (isLoading) {
    return (
      <div className={styles.centerPage}>
        <Spinner size={32} />
      </div>
    );
  }

  if (isError || !group) {
    return (
      <div className={styles.centerPage}>
        <EmptyResults
          variant="error"
          title={t('community.groupNotFound')}
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

  const isMember = userId ? group.members.some((m) => m.id === userId) : false;
  const isCreator = userId === group.creator_id;

  function handleJoin() {
    if (!groupId) return;
    requireAuth(() => {
      join(groupId, {
        onSuccess: () => push({ variant: 'success', message: t('community.joinedGroup') }),
        onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
      });
    }, t('community.joinRequiresAuth'));
  }

  function handleLeave() {
    leave(undefined, {
      onSuccess: () => push({ variant: 'success', message: t('community.leftGroup') }),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  function handleOpenCreatePost() {
    requireAuth(() => setCreatePostOpen(true), t('community.postRequiresAuth'));
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroMesh} aria-hidden="true" />
        <DetailBackButton fallbackTo="/community" className={styles.backBtn} />
        <div className={styles.heroContent}>
          <span className={styles.heroIcon}>
            <Users size={28} strokeWidth={1.75} />
          </span>
          <h1 className={styles.title}>{group.name}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.metaItem}>
              <Users size={14} strokeWidth={2} />
              {t('community.memberCount', { count: group.members.length })}
            </span>
            {group.region && (
              <span className={styles.metaItem}>
                <MapPin size={14} strokeWidth={2} />
                {group.region}
              </span>
            )}
            {group.theme && (
              <span className={styles.metaItem}>
                <Tag size={14} strokeWidth={2} />
                {t(`community.themes.${group.theme}`, group.theme)}
              </span>
            )}
            {!group.is_public && (
              <span className={styles.metaItem}>
                <Lock size={14} strokeWidth={2} />
                {t('community.privateGroup')}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className={styles.body}>
        {group.description && <p className={styles.description}>{group.description}</p>}

        <div className={styles.actionRow}>
          {!isMember && (
            <Button onClick={handleJoin} disabled={isJoining}>
              {isJoining ? t('common.loading') : t('community.joinGroup')}
            </Button>
          )}
          {isMember && !isCreator && (
            <Button variant="secondary" onClick={handleLeave} disabled={isLeaving}>
              {isLeaving ? t('common.loading') : t('community.leaveGroup')}
            </Button>
          )}
          {isCreator && <span className={styles.creatorBadge}>{t('community.youAreCreator')}</span>}
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'chat' && styles.tabActive)}
            onClick={() => setTab('chat')}
          >
            {t('community.tabChat')}
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'posts' && styles.tabActive)}
            onClick={() => setTab('posts')}
          >
            {t('community.tabPosts')}
          </button>
          <button
            type="button"
            className={clsx(styles.tab, tab === 'members' && styles.tabActive)}
            onClick={() => setTab('members')}
          >
            {t('community.membersTitle')}
          </button>
        </div>

        {tab === 'chat' && (
          <section className={styles.chatSection}>
            {isMember && group.conversation_id ? (
              <ChatWindow conversationId={group.conversation_id} />
            ) : (
              <EmptyResults
                variant="empty"
                title={t('community.chatRequiresMembership')}
                text={t('community.chatRequiresMembershipText')}
              />
            )}
          </section>
        )}

        {tab === 'posts' && (
          <section className={styles.section}>
            <div className={styles.postsHeader}>
              <Button size="sm" onClick={handleOpenCreatePost}>
                <Plus size={15} strokeWidth={2} />
                {t('community.createPost')}
              </Button>
            </div>

            {isLoadingPosts && (
              <div className={styles.center}>
                <Spinner size={24} />
              </div>
            )}

            {!isLoadingPosts && (!postsData || postsData.items.length === 0) && (
              <EmptyResults variant="empty" title={t('community.noPosts')} text={t('community.noPostsText')} />
            )}

            {!isLoadingPosts && postsData && postsData.items.length > 0 && (
              <div className={styles.postsList}>
                {postsData.items.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === 'members' && (
          <section className={styles.section}>
            <div className={styles.memberList}>
              {group.members.map((member) => (
                <div key={member.id} className={styles.memberRow}>
                  <Avatar
                    src={member.avatar_url}
                    name={member.full_name}
                    size={36}
                    className={styles.memberAvatar}
                  />
                  <span className={styles.memberName}>{member.full_name}</span>
                  {member.id === group.creator_id && (
                    <span className={styles.creatorTag}>{t('community.creatorTag')}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <CreatePostModal open={createPostOpen} onClose={() => setCreatePostOpen(false)} groupId={groupId} />
    </div>
  );
}

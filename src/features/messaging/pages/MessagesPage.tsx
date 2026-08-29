import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import clsx from 'clsx';

import { EmptyResults, Spinner, DetailBackButton } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import { getPostLoginPath } from '../../pro/utils/postLoginRedirect';
import { useConversations } from '../hooks/useConversations';
import { ConversationListItem } from '../components/ConversationListItem';
import { ChatWindow } from '../components/ChatWindow';
import styles from './MessagesPage.module.css';

export function MessagesPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const fallbackTo = user ? getPostLoginPath(user, '/profile') : '/profile';
  const [searchParams] = useSearchParams();
  const { data: conversations, isLoading, isError, refetch } = useConversations();
  const [activeId, setActiveId] = useState<string | undefined>(searchParams.get('conversation') ?? undefined);

  useEffect(() => {
    const fromUrl = searchParams.get('conversation');
    if (fromUrl) setActiveId(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const activeConversation = conversations?.find((c) => c.id === activeId);

  return (
    <div className={styles.page}>
      <aside className={clsx(styles.sidebar, activeId && styles.sidebarHiddenMobile)}>
        <DetailBackButton fallbackTo={fallbackTo} variant="link">
          {t('common.back')}
        </DetailBackButton>
        <h1 className={styles.title}>{t('messaging.title')}</h1>

        {isLoading && (
          <div className={styles.center}>
            <Spinner size={24} />
          </div>
        )}

        {!isLoading && isError && <EmptyResults variant="error" onRetry={() => refetch()} />}

        {!isLoading && !isError && (!conversations || conversations.length === 0) && (
          <EmptyResults
            variant="empty"
            title={t('messaging.empty')}
            text={t('messaging.emptyText')}
          />
        )}

        {!isLoading && !isError && conversations && conversations.length > 0 && (
          <div className={styles.list}>
            {conversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                active={conversation.id === activeId}
                onClick={() => setActiveId(conversation.id)}
              />
            ))}
          </div>
        )}
      </aside>

      <section className={clsx(styles.main, !activeId && styles.mainHiddenMobile)}>
        {activeConversation ? (
          <>
            <div className={styles.chatHeader}>
              <button type="button" className={styles.backBtn} onClick={() => setActiveId(undefined)}>
                {t('common.back')}
              </button>
              <span>{t(`messaging.kinds.${activeConversation.kind}`)}</span>
            </div>
            <ChatWindow conversationId={activeConversation.id} />
          </>
        ) : (
          <div className={styles.placeholder}>
            <MessageCircle size={40} strokeWidth={1.5} />
            <p>{t('messaging.selectConversation')}</p>
          </div>
        )}
      </section>
    </div>
  );
}

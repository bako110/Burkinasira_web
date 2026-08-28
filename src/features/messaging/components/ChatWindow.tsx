import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import clsx from 'clsx';

import { Spinner } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useAuthStore } from '../../../store/auth.store';
import { useMessages } from '../hooks/useMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import styles from './ChatWindow.module.css';

export function ChatWindow({ conversationId }: { conversationId: string }) {
  const { t, i18n } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const push = useToastStore((s) => s.push);
  const { data: messages, isLoading } = useMessages(conversationId);
  const { mutate: send, isPending } = useSendMessage(conversationId);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    send(
      { content },
      {
        onSuccess: () => setDraft(''),
        onError: (error) => {
          push({ variant: 'error', message: extractApiErrorMessage(error, t('messaging.sendError')) });
        },
      },
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.messages}>
        {isLoading && (
          <div className={styles.loading}>
            <Spinner size={24} />
          </div>
        )}

        {!isLoading &&
          messages?.map((message) => {
            const isMine = message.sender_id === userId;
            return (
              <div key={message.id} className={clsx(styles.bubbleRow, isMine && styles.bubbleRowMine)}>
                <div className={clsx(styles.bubble, isMine && styles.bubbleMine)}>
                  {message.content && <p className={styles.bubbleText}>{message.content}</p>}
                  <span className={styles.bubbleTime}>
                    {new Date(message.created_at).toLocaleTimeString(i18n.language, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })}

        <div ref={bottomRef} />
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('messaging.placeholder')}
          aria-label={t('messaging.placeholder')}
        />
        <button type="submit" className={styles.sendBtn} disabled={isPending || !draft.trim()}>
          <Send size={18} strokeWidth={2} />
        </button>
      </form>
    </div>
  );
}

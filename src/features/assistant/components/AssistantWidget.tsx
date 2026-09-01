import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, X, Send } from 'lucide-react';
import clsx from 'clsx';

import { Spinner } from '../../../shared/ui';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useSendAssistantMessage } from '../hooks/useSendAssistantMessage';
import type { AIMessage } from '../types';
import styles from './AssistantWidget.module.css';

export function AssistantWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: sendMessage, isPending } = useSendAssistantMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, open]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || isPending) return;

    const optimisticMessage: AIMessage = { role: 'user', content, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, optimisticMessage]);
    setDraft('');
    setErrorMessage(null);

    sendMessage(
      { conversation_id: conversationId, message: content },
      {
        onSuccess: (conversation) => {
          setConversationId(conversation.id);
          setMessages(conversation.messages);
        },
        onError: (error) => {
          setErrorMessage(extractApiErrorMessage(error, t('assistant.error')));
        },
      },
    );
  }

  return (
    <>
      <button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((o) => !o)}
        aria-label={t('assistant.title')}
      >
        {open ? <X size={22} strokeWidth={2} /> : <Sparkles size={22} strokeWidth={2} />}
      </button>

      <div className={clsx(styles.panel, open && styles.panelOpen)}>
        <div className={styles.header}>
          <span className={styles.headerTitle}>
            <Sparkles size={16} strokeWidth={2} />
            {t('assistant.title')}
          </span>
          <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)} aria-label={t('common.close')}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.messages}>
          {messages.length === 0 && (
            <p className={styles.welcome}>{t('assistant.welcome')}</p>
          )}
          {messages.map((message, i) => (
            <div key={i} className={clsx(styles.bubbleRow, message.role === 'user' && styles.bubbleRowMine)}>
              <div className={clsx(styles.bubble, message.role === 'user' && styles.bubbleMine)}>
                {message.content}
              </div>
            </div>
          ))}
          {isPending && (
            <div className={styles.bubbleRow}>
              <div className={styles.bubble}>
                <Spinner size={14} />
              </div>
            </div>
          )}
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
          <div ref={bottomRef} />
        </div>

        <form className={styles.composer} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('assistant.placeholder')}
            aria-label={t('assistant.placeholder')}
            disabled={isPending}
          />
          <button type="submit" className={styles.sendBtn} disabled={isPending || !draft.trim()}>
            <Send size={16} strokeWidth={2} />
          </button>
        </form>
      </div>
    </>
  );
}

import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, ImageOff, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import clsx from 'clsx';

import { Spinner, ImmersiveGallery, Modal, Avatar } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useLikePost } from '../hooks/useLikePost';
import { useComments, useAddComment } from '../hooks/useComments';
import type { Post } from '../types';
import styles from './PostCard.module.css';

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

export function PostCard({ post }: { post: Post }) {
  const { t, i18n } = useTranslation();
  const requireAuth = useRequireAuth();
  const { mutate: like, isPending: isLiking } = useLikePost();
  const [mediaIndex, setMediaIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const media = post.media_urls;
  const activeMedia = media[mediaIndex];

  function handleLike() {
    if (isLiking) return;
    requireAuth(() => like(post.id), t('community.likeRequiresAuth'));
  }

  function goTo(delta: number) {
    setMediaIndex((i) => (i + delta + media.length) % media.length);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Avatar
          src={post.author_avatar_url}
          name={post.author_name}
          size={36}
          className={styles.avatar}
        />
        <div className={styles.headerText}>
          <span className={styles.authorName}>{post.author_name ?? t('community.someMember')}</span>
          <span className={styles.date}>
            {new Date(post.created_at).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long' })}
          </span>
        </div>
        <span className={styles.typeTag}>{t(`community.postTypes.${post.type}`)}</span>
      </div>

      {post.caption && <p className={styles.caption}>{post.caption}</p>}

      {activeMedia && (
        <div className={styles.media}>
          <button type="button" className={styles.mediaButton} onClick={() => setGalleryOpen(true)}>
            {isVideoUrl(activeMedia) ? (
              <video src={activeMedia} controls className={styles.mediaEl} onClick={(e) => e.stopPropagation()} />
            ) : (
              <img src={activeMedia} alt="" className={styles.mediaEl} />
            )}
          </button>
          {media.length > 1 && (
            <>
              <button
                type="button"
                className={clsx(styles.mediaNav, styles.mediaNavLeft)}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(-1);
                }}
              >
                <ChevronLeft size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={clsx(styles.mediaNav, styles.mediaNavRight)}
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(1);
                }}
              >
                <ChevronRight size={18} strokeWidth={2} />
              </button>
              <span className={styles.mediaCounter}>
                {mediaIndex + 1}/{media.length}
              </span>
            </>
          )}
        </div>
      )}

      {!activeMedia && post.type !== 'recommandation' && (
        <div className={styles.mediaPlaceholder}>
          <ImageOff size={28} strokeWidth={1.5} />
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={clsx(styles.actionBtn, post.is_liked_by_me && styles.actionBtnActive)}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart size={15} strokeWidth={2} fill={post.is_liked_by_me ? 'currentColor' : 'none'} />
          {post.like_count}
        </button>
        <button type="button" className={styles.actionBtn} onClick={() => setCommentsOpen((v) => !v)}>
          <MessageCircle size={15} strokeWidth={2} />
          {post.comment_count}
        </button>
      </div>

      <CommentSheet postId={post.id} open={commentsOpen} onClose={() => setCommentsOpen(false)} />

      <ImmersiveGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        urls={media}
        startIndex={mediaIndex}
        title={post.author_name ?? t('community.someMember')}
      />
    </div>
  );
}

interface CommentSheetProps {
  postId: string;
  open: boolean;
  onClose: () => void;
}

function CommentSheet({ postId, open, onClose }: CommentSheetProps) {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const { data: comments, isLoading } = useComments(postId);
  const { mutate: addComment, isPending } = useAddComment(postId);
  const [content, setContent] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    requireAuth(
      () =>
        addComment(
          { content: content.trim() },
          {
            onSuccess: () => setContent(''),
          },
        ),
      t('community.commentRequiresAuth'),
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={t('community.commentsTitle')}>
      <div className={styles.commentSection}>
        {isLoading && (
          <div className={styles.commentLoading}>
            <Spinner size={18} />
          </div>
        )}

        {!isLoading && comments && comments.length === 0 && (
          <p className={styles.noComments}>{t('community.noComments')}</p>
        )}

        {!isLoading && comments && comments.length > 0 && (
          <div className={styles.commentList}>
            {comments.map((c) => (
              <div key={c.id} className={styles.commentItem}>
                <span className={styles.commentAuthor}>{t('community.someMember')}</span>
                <span className={styles.commentContent}>{c.content}</span>
              </div>
            ))}
          </div>
        )}

        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.commentInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('community.commentPlaceholder')}
          />
          <button type="submit" className={styles.commentSubmit} disabled={isPending || !content.trim()}>
            {isPending ? <Spinner size={14} /> : <Send size={14} strokeWidth={2} />}
          </button>
        </form>
      </div>
    </Modal>
  );
}

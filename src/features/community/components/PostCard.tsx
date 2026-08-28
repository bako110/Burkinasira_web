import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, User, ImageOff } from 'lucide-react';
import clsx from 'clsx';

import { useLikePost } from '../hooks/useLikePost';
import type { Post } from '../types';
import styles from './PostCard.module.css';

export function PostCard({ post }: { post: Post }) {
  const { t, i18n } = useTranslation();
  const { mutate: like, isPending } = useLikePost();
  const [liked, setLiked] = useState(false);
  const cover = post.media_urls[0];

  function handleLike() {
    if (liked || isPending) return;
    like(post.id, { onSuccess: () => setLiked(true) });
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.avatar}>
          {post.author_avatar_url ? (
            <img src={post.author_avatar_url} alt="" />
          ) : (
            <User size={16} strokeWidth={1.75} />
          )}
        </span>
        <div className={styles.headerText}>
          <span className={styles.authorName}>{post.author_name ?? t('community.someMember')}</span>
          <span className={styles.date}>
            {new Date(post.created_at).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long' })}
          </span>
        </div>
        <span className={styles.typeTag}>{t(`community.postTypes.${post.type}`)}</span>
      </div>

      {post.caption && <p className={styles.caption}>{post.caption}</p>}

      {cover && (
        <div className={styles.media}>
          {post.type === 'video' ? (
            <video src={cover} controls className={styles.mediaEl} />
          ) : (
            <img src={cover} alt="" className={styles.mediaEl} />
          )}
        </div>
      )}

      {!cover && post.type !== 'recommandation' && (
        <div className={styles.mediaPlaceholder}>
          <ImageOff size={28} strokeWidth={1.5} />
        </div>
      )}

      <div className={styles.footer}>
        <button
          type="button"
          className={clsx(styles.actionBtn, liked && styles.actionBtnActive)}
          onClick={handleLike}
          disabled={isPending}
        >
          <Heart size={15} strokeWidth={2} fill={liked ? 'currentColor' : 'none'} />
          {post.like_count + (liked ? 1 : 0)}
        </button>
        <span className={styles.actionBtn}>
          <MessageCircle size={15} strokeWidth={2} />
          {post.comment_count}
        </span>
      </div>
    </div>
  );
}

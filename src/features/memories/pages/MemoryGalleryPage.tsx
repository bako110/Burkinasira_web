import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Images, Play } from 'lucide-react';

import { Spinner, EmptyResults, DetailBackButton } from '../../../shared/ui';
import { useInfiniteScrollSentinel } from '../../../shared/hooks/useInfiniteScrollSentinel';
import { useAuthStore } from '../../../store/auth.store';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useMemoriesInfinite, useDeleteMemory } from '../hooks';
import type { MemoryTargetType } from '../types';
import { MemoryLightbox } from '../components/MemoryLightbox';
import styles from './MemoryGalleryPage.module.css';

export function MemoryGalleryPage() {
  const { t } = useTranslation();
  const { targetType, targetId } = useParams<{ targetType: MemoryTargetType; targetId: string }>();
  const push = useToastStore((s) => s.push);
  const userId = useAuthStore((s) => s.user?.id);

  const { items, total, hasMore, isInitialLoading, isFetchingMore, isError, loadMore } = useMemoriesInfinite(
    targetType as MemoryTargetType,
    targetId,
  );
  const deleteMemory = useDeleteMemory(targetType as MemoryTargetType, targetId);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sentinelRef = useInfiniteScrollSentinel<HTMLDivElement>(loadMore, { enabled: hasMore && !isInitialLoading });

  function handleDelete(memoryId: string) {
    deleteMemory.mutate(memoryId, {
      onSuccess: () => setActiveIndex(null),
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
            <Images size={22} strokeWidth={1.75} />
          </span>
          <h1 className={styles.heroTitle}>{t('memories.sectionTitle')}</h1>
          {total > 0 && <p className={styles.heroSubtitle}>{t('memories.galleryCount', { count: total })}</p>}
        </div>
      </section>

      <div className={styles.body}>
        {isInitialLoading && (
          <div className={styles.center}>
            <Spinner size={28} />
          </div>
        )}

        {!isInitialLoading && isError && <EmptyResults variant="error" />}

        {!isInitialLoading && !isError && items.length === 0 && (
          <EmptyResults variant="empty" title={t('memories.none')} />
        )}

        {!isInitialLoading && !isError && items.length > 0 && (
          <>
            <div className={styles.grid}>
              {items.map((memory, index) => (
                <button
                  key={memory.id}
                  type="button"
                  className={styles.tile}
                  onClick={() => setActiveIndex(index)}
                  aria-label={memory.title ?? memory.caption ?? t('memories.sectionTitle')}
                >
                  {memory.media_type === 'video' ? (
                    <video src={memory.media_url} className={styles.tileMedia} muted preload="metadata" />
                  ) : (
                    <img src={memory.media_url} alt="" className={styles.tileMedia} loading="lazy" />
                  )}
                  <span className={styles.tileOverlay} aria-hidden="true" />
                  {memory.media_type === 'video' && (
                    <span className={styles.playBadge}>
                      <Play size={16} strokeWidth={2} fill="currentColor" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {hasMore && (
              <div ref={sentinelRef} className={styles.sentinel}>
                {isFetchingMore && <Spinner size={22} />}
              </div>
            )}
          </>
        )}
      </div>

      {activeIndex !== null && items[activeIndex] && (
        <MemoryLightbox
          items={items}
          startIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          currentUserId={userId}
          onDelete={handleDelete}
          isDeleting={deleteMemory.isPending}
        />
      )}
    </div>
  );
}

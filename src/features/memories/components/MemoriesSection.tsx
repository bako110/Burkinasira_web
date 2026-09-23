import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Camera, Images, Play, ArrowRight } from 'lucide-react';

import { Spinner, Reveal, Button } from '../../../shared/ui';
import { useRequireAuth } from '../../../shared/hooks/useRequireAuth';
import { useAuthStore } from '../../../store/auth.store';
import { useToastStore } from '../../../store/toast.store';
import { extractApiErrorMessage } from '../../../shared/api/client';
import { useMemoriesForTarget, useDeleteMemory } from '../hooks';
import type { MemoryTargetType } from '../types';
import { ShareMemoryModal } from './ShareMemoryModal';
import { MemoryLightbox } from './MemoryLightbox';
import styles from './MemoriesSection.module.css';

interface MemoriesSectionProps {
  targetType: MemoryTargetType;
  targetId: string | undefined;
}

export function MemoriesSection({ targetType, targetId }: MemoriesSectionProps) {
  const { t } = useTranslation();
  const requireAuth = useRequireAuth();
  const push = useToastStore((s) => s.push);
  const userId = useAuthStore((s) => s.user?.id);

  const { data, isLoading } = useMemoriesForTarget(targetType, targetId);
  const deleteMemory = useDeleteMemory(targetType, targetId);

  const [shareOpen, setShareOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function handleShareClick() {
    requireAuth(() => setShareOpen(true), t('memories.shareRequiresAuth'));
  }

  function handleDelete(memoryId: string) {
    deleteMemory.mutate(memoryId, {
      onSuccess: () => setActiveIndex(null),
      onError: (err) => push({ variant: 'error', message: extractApiErrorMessage(err, t('common.error')) }),
    });
  }

  const PREVIEW_LIMIT = 9;
  const allItems = data?.items ?? [];
  const total = data?.total ?? 0;
  const items = allItems.slice(0, PREVIEW_LIMIT);
  const hasMoreThanPreview = total > PREVIEW_LIMIT;

  return (
    <Reveal as="section" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.sectionKicker}>{t('memories.sectionKicker')}</span>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{t('memories.sectionTitle')}</h2>
            {total > 0 && (
              <span className={styles.countBadge}>
                <Images size={13} strokeWidth={2} />
                {total}
              </span>
            )}
          </div>
        </div>

        <Button size="sm" className={styles.shareBtn} onClick={handleShareClick} disabled={!targetId}>
          <Camera size={16} strokeWidth={2} />
          {t('memories.shareCta')}
        </Button>
      </div>

      {isLoading && (
        <div className={styles.center}>
          <Spinner size={22} />
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <Images size={22} strokeWidth={1.5} />
          </span>
          <p className={styles.empty}>{t('memories.none')}</p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
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
                <video
                  src={memory.media_url}
                  className={styles.tileMedia}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
              ) : (
                <img src={memory.media_url} alt="" className={styles.tileMedia} loading="lazy" />
              )}
              <span className={styles.tileOverlay} aria-hidden="true" />
              {memory.media_type === 'video' && (
                <span className={styles.playBadge}>
                  <Play size={16} strokeWidth={2} fill="currentColor" />
                </span>
              )}
              {memory.title && <span className={styles.tileTitle}>{memory.title}</span>}
            </button>
          ))}
        </div>
      )}

      {hasMoreThanPreview && targetId && (
        <Link to={`/memories/${targetType}/${targetId}`} className={styles.seeAllLink}>
          {t('memories.seeAll', { count: total })}
          <ArrowRight size={15} strokeWidth={2} />
        </Link>
      )}

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

      {targetId && (
        <ShareMemoryModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          targetType={targetType}
          targetId={targetId}
        />
      )}
    </Reveal>
  );
}

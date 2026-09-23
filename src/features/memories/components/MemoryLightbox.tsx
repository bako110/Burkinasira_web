import { useEffect, useRef, useState, type WheelEvent as ReactWheelEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Trash2, Volume2, VolumeX } from 'lucide-react';
import clsx from 'clsx';

import { Avatar, Spinner } from '../../../shared/ui';
import type { Memory } from '../types';
import styles from './MemoryLightbox.module.css';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface MemoryLightboxProps {
  items: Memory[];
  startIndex: number;
  onClose: () => void;
  currentUserId?: string;
  onDelete: (memoryId: string) => void;
  isDeleting: boolean;
}

export function MemoryLightbox({ items, startIndex, onClose, currentUserId, onDelete, isDeleting }: MemoryLightboxProps) {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [muted, setMuted] = useState(true);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const touchStartX = useRef<number | null>(null);

  const active = items[activeIndex];

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [activeIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(1);
      if (e.key === 'ArrowLeft') goTo(-1);
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (!active) return null;

  function goTo(delta: number) {
    setActiveIndex((i) => (i + delta + items.length) % items.length);
  }

  function handleWheel(e: ReactWheelEvent) {
    if (active.media_type !== 'photo') return;
    e.preventDefault();
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z - e.deltaY * 0.0015)));
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (zoom <= 1) return;
    dragState.current = { startX: e.clientX, startY: e.clientY, originX: pan.x, originY: pan.y };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setPan({ x: dragState.current.originX + dx, y: dragState.current.originY + dy });
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleTouchStart(e: React.TouchEvent) {
    if (zoom > 1) return;
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) goTo(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  const isVideo = active.media_type === 'video';
  const isOwner = active.author_id === currentUserId;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={active.title ?? t('memories.sectionTitle')}>
      <div className={styles.header}>
        <div className={styles.headerAuthor}>
          <Avatar src={active.author_avatar_url} name={active.author_name} size={36} />
          <div className={styles.headerAuthorText}>
            <span className={styles.headerAuthorName}>{active.author_name ?? t('reviews.anonymous')}</span>
            <span className={styles.headerDate}>
              {new Date(active.created_at).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {items.length > 1 && (
          <span className={styles.counter}>
            {activeIndex + 1} / {items.length}
          </span>
        )}

        <div className={styles.headerActions}>
          {!isVideo && (
            <>
              <button type="button" className={styles.iconButton} onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))} aria-label={t('gallery.zoomOut')}>
                <ZoomOut size={18} strokeWidth={2} />
              </button>
              <button type="button" className={styles.iconButton} onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))} aria-label={t('gallery.zoomIn')}>
                <ZoomIn size={18} strokeWidth={2} />
              </button>
            </>
          )}
          {isOwner && (
            <button
              type="button"
              className={clsx(styles.iconButton, styles.deleteButton)}
              onClick={() => onDelete(active.id)}
              disabled={isDeleting}
              aria-label={t('common.delete')}
            >
              {isDeleting ? <Spinner size={16} /> : <Trash2 size={18} strokeWidth={2} />}
            </button>
          )}
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label={t('common.close')}>
            <X size={22} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        className={styles.stage}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.length > 1 && (
          <button type="button" className={clsx(styles.navButton, styles.navButtonLeft)} onClick={() => goTo(-1)} aria-label={t('gallery.previous')}>
            <ChevronLeft size={26} strokeWidth={2} />
          </button>
        )}

        <div
          key={active.id}
          className={styles.mediaWrap}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {isVideo ? (
            <div className={styles.videoWrap}>
              <video src={active.media_url} className={styles.media} controls autoPlay playsInline muted={muted} />
              <button
                type="button"
                className={styles.muteButton}
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? t('memories.unmute') : t('memories.mute')}
              >
                {muted ? <VolumeX size={16} strokeWidth={2} /> : <Volume2 size={16} strokeWidth={2} />}
              </button>
            </div>
          ) : (
            <img
              src={active.media_url}
              alt=""
              className={styles.media}
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, cursor: zoom > 1 ? 'grab' : 'default' }}
              draggable={false}
            />
          )}
        </div>

        {items.length > 1 && (
          <button type="button" className={clsx(styles.navButton, styles.navButtonRight)} onClick={() => goTo(1)} aria-label={t('gallery.next')}>
            <ChevronRight size={26} strokeWidth={2} />
          </button>
        )}
      </div>

      {(active.title || active.caption) && (
        <div className={styles.captionBar}>
          {active.title && <span className={styles.captionTitle}>{active.title}</span>}
          {active.caption && <p className={styles.captionText}>{active.caption}</p>}
        </div>
      )}

      {items.length > 1 && (
        <div className={styles.thumbStrip}>
          {items.map((memory, i) => (
            <button
              key={memory.id}
              type="button"
              className={clsx(styles.thumb, i === activeIndex && styles.thumbActive)}
              onClick={() => setActiveIndex(i)}
            >
              {memory.media_type === 'video' ? (
                <video src={memory.media_url} muted className={styles.thumbMedia} />
              ) : (
                <img src={memory.media_url} alt="" className={styles.thumbMedia} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

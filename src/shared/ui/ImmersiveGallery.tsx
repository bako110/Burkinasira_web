import { useEffect, useRef, useState, type WheelEvent as ReactWheelEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import styles from './ImmersiveGallery.module.css';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m3u8'];

function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase().split('?')[0];
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface ImmersiveGalleryProps {
  open: boolean;
  onClose: () => void;
  urls: string[];
  title?: string;
  startIndex?: number;
}

export function ImmersiveGallery({ open, onClose, urls, title, startIndex = 0 }: ImmersiveGalleryProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setActiveIndex(startIndex);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [activeIndex]);

  useEffect(() => {
    if (!open) return;
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
  }, [open, urls.length]);

  if (!open || urls.length === 0) return null;

  function goTo(delta: number) {
    setActiveIndex((i) => (i + delta + urls.length) % urls.length);
  }

  function handleWheel(e: ReactWheelEvent) {
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

  const activeUrl = urls[activeIndex];
  const isVideo = isVideoUrl(activeUrl);

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title ?? t('gallery.title')}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          <Maximize2 size={16} strokeWidth={2} />
          {title ?? t('gallery.title')}
          {urls.length > 1 && (
            <span className={styles.counter}>
              {activeIndex + 1} / {urls.length}
            </span>
          )}
        </span>
        <div className={styles.headerActions}>
          {!isVideo && (
            <>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))}
                aria-label={t('gallery.zoomOut')}
              >
                <ZoomOut size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))}
                aria-label={t('gallery.zoomIn')}
              >
                <ZoomIn size={18} strokeWidth={2} />
              </button>
            </>
          )}
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label={t('common.close')}>
            <X size={22} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div
        className={styles.stage}
        onWheel={!isVideo ? handleWheel : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {urls.length > 1 && (
          <button
            type="button"
            className={clsx(styles.navButton, styles.navButtonLeft)}
            onClick={() => goTo(-1)}
            aria-label={t('gallery.previous')}
          >
            <ChevronLeft size={26} strokeWidth={2} />
          </button>
        )}

        <div
          key={activeIndex}
          className={styles.mediaWrap}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {isVideo ? (
            <video src={activeUrl} className={styles.media} controls autoPlay playsInline />
          ) : (
            <img
              src={activeUrl}
              alt=""
              className={styles.media}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                cursor: zoom > 1 ? 'grab' : 'default',
              }}
              draggable={false}
            />
          )}
        </div>

        {urls.length > 1 && (
          <button
            type="button"
            className={clsx(styles.navButton, styles.navButtonRight)}
            onClick={() => goTo(1)}
            aria-label={t('gallery.next')}
          >
            <ChevronRight size={26} strokeWidth={2} />
          </button>
        )}
      </div>

      {urls.length > 1 && (
        <div className={styles.thumbStrip}>
          {urls.map((url, i) => (
            <button
              key={url}
              type="button"
              className={clsx(styles.thumb, i === activeIndex && styles.thumbActive)}
              onClick={() => setActiveIndex(i)}
            >
              {isVideoUrl(url) ? (
                <video src={url} muted className={styles.thumbMedia} />
              ) : (
                <img src={url} alt="" className={styles.thumbMedia} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

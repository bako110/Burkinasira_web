import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import '@photo-sphere-viewer/core/index.css';
import '@photo-sphere-viewer/video-plugin/index.css';
import styles from './Virtual360Viewer.module.css';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m3u8'];

function isVideoUrl(url: string): boolean {
  const lower = url.toLowerCase().split('?')[0];
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

interface Virtual360ViewerProps {
  open: boolean;
  onClose: () => void;
  urls: string[];
  title?: string;
}

export function Virtual360Viewer({ open, onClose, urls, title }: Virtual360ViewerProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ destroy: () => void } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open || !containerRef.current || urls.length === 0) return;

    let cancelled = false;
    setIsLoading(true);
    const activeUrl = urls[activeIndex];
    const container = containerRef.current;

    async function mount() {
      const { Viewer } = await import('@photo-sphere-viewer/core');
      if (cancelled || !container) return;

      viewerRef.current?.destroy();

      if (isVideoUrl(activeUrl)) {
        const { VideoPlugin } = await import('@photo-sphere-viewer/video-plugin');
        const { EquirectangularVideoAdapter } = await import('@photo-sphere-viewer/equirectangular-video-adapter');
        if (cancelled) return;
        const viewer = new Viewer({
          container,
          adapter: EquirectangularVideoAdapter,
          panorama: { source: activeUrl },
          plugins: [VideoPlugin],
          navbar: ['zoom', 'fullscreen'],
          loadingImg: undefined,
        });
        viewerRef.current = viewer;
      } else {
        const viewer = new Viewer({
          container,
          panorama: activeUrl,
          navbar: ['zoom', 'fullscreen'],
        });
        viewerRef.current = viewer;
      }
      if (!cancelled) setIsLoading(false);
    }

    mount();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, [open, activeIndex, urls]);

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title ?? t('virtualTour.title')}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>
          <RotateCw size={16} strokeWidth={2} />
          {title ?? t('virtualTour.title')}
        </span>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t('common.close')}>
          <X size={22} strokeWidth={2} />
        </button>
      </div>

      <div className={styles.stage}>
        {isLoading && <div className={styles.loadingHint}>{t('virtualTour.loading')}</div>}
        <div ref={containerRef} className={styles.viewerContainer} />
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

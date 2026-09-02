import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';
import styles from './PanoramaViewer.module.css';

// Pannellum s'attache à window.pannellum (pas d'export ESM).
type PannellumViewer = {
  destroy: () => void;
  loadScene?: (id: string) => void;
};
type PannellumApi = {
  viewer: (
    container: HTMLElement | string,
    config: Record<string, unknown>,
  ) => PannellumViewer;
};
declare global {
  interface Window {
    pannellum?: PannellumApi;
  }
}

interface PanoramaViewerProps {
  open: boolean;
  onClose: () => void;
  /** Photos équirectangulaires (ratio 2:1). */
  urls: string[];
  title?: string;
  startIndex?: number;
}

/**
 * Visite à 360° plein écran, basée sur Pannellum (WebGL). Les `urls` doivent
 * pointer vers des panoramas équirectangulaires. Le gyroscope est activé sur
 * mobile pour explorer la scène en bougeant le téléphone.
 */
export function PanoramaViewer({ open, onClose, urls, title, startIndex = 0 }: PanoramaViewerProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const [index, setIndex] = useState(startIndex);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % Math.max(urls.length, 1));
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + urls.length) % Math.max(urls.length, 1));
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, urls.length]);

  // (Re)crée le viewer quand la scène change.
  useEffect(() => {
    if (!open || !containerRef.current || !urls[index]) return;
    setFailed(false);

    const api = window.pannellum;
    if (!api) {
      setFailed(true);
      return;
    }

    let destroyed = false;
    try {
      viewerRef.current = api.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: urls[index],
        autoLoad: true,
        showControls: false,
        compass: false,
        orientationOnByDefault: true, // gyroscope mobile
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
      });
    } catch {
      if (!destroyed) setFailed(true);
    }

    return () => {
      destroyed = true;
      try {
        viewerRef.current?.destroy();
      } catch {
        /* viewer déjà libéré */
      }
      viewerRef.current = null;
    };
  }, [open, index, urls]);

  if (!open) return null;

  const hasMultiple = urls.length > 1;

  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.topBar}>
        <span className={styles.badge}>
          <Compass size={14} strokeWidth={2} />
          {t('panorama.badge')}
          {hasMultiple ? ` · ${index + 1}/${urls.length}` : ''}
        </span>
        <button type="button" className={styles.iconBtn} onClick={onClose} aria-label={t('common.close')}>
          <X size={18} strokeWidth={2} />
        </button>
      </div>

      {failed ? (
        <div className={styles.error}>{t('panorama.error')}</div>
      ) : (
        <div ref={containerRef} className={styles.stage} />
      )}

      {hasMultiple && !failed && (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.navLeft}`}
            onClick={() => setIndex((i) => (i - 1 + urls.length) % urls.length)}
            aria-label={t('gallery.previous')}
          >
            <ChevronLeft size={22} strokeWidth={2} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.navRight}`}
            onClick={() => setIndex((i) => (i + 1) % urls.length)}
            aria-label={t('gallery.next')}
          >
            <ChevronRight size={22} strokeWidth={2} />
          </button>
        </>
      )}

      <p className={styles.hint}>{t('panorama.hint')}</p>
    </div>,
    document.body,
  );
}

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download, User, BadgeCheck } from 'lucide-react';

import { Button } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import type { UserPublic } from '../../../shared/api/types';
import styles from './FasoVivaIdCard.module.css';

interface FasoVivaIdCardProps {
  user: UserPublic;
  points: number;
}

async function toDataUrl(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function FasoVivaIdCard({ user, points }: FasoVivaIdCardProps) {
  const { t, i18n } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const push = useToastStore((s) => s.push);
  const [isDownloading, setIsDownloading] = useState(false);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user.avatar_url) {
      setAvatarDataUrl(null);
      return;
    }
    toDataUrl(user.avatar_url).then((dataUrl) => {
      if (!cancelled) setAvatarDataUrl(dataUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [user.avatar_url]);

  const memberSince = user.id
    ? new Date(parseInt(user.id.slice(0, 8), 16) * 1000).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'short',
      })
    : '';

  async function handleDownload() {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true });
      const link = document.createElement('a');
      link.download = `fasoviva-carte-${user.full_name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      push({ variant: 'error', message: t('passport.cardDownloadError') });
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div ref={cardRef} className={styles.card}>
        <img src="/logo.png" alt="" className={styles.watermark} />
        <div className={styles.overlay} />

        <div className={styles.header}>
          <span className={styles.brand}>FasoViva</span>
          <span className={styles.cardLabel}>{t('passport.cardLabel')}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.photoWrap}>
            {avatarDataUrl ? (
              <img src={avatarDataUrl} alt={user.full_name} className={styles.photo} />
            ) : (
              <div className={styles.photoPlaceholder}>
                <User size={36} strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className={styles.info}>
            <span className={styles.nameRow}>
              <span className={styles.name}>{user.full_name}</span>
              {user.is_verified && (
                <BadgeCheck size={16} strokeWidth={2} className={styles.verifiedIcon} />
              )}
            </span>
            <span className={styles.role}>{t(`auth.role${capitalize(user.role)}`, user.role)}</span>
            <span className={styles.meta}>
              {t('passport.memberSince', { date: memberSince })}
            </span>
            <span className={styles.meta}>{t('passport.points')}: {points.toLocaleString('fr-FR')}</span>
          </div>

          <div className={styles.qrWrap}>
            <QRCodeCanvas
              value={`${window.location.origin}/verify/${user.id}`}
              size={84}
              bgColor="#ffffff"
              fgColor="#1a1a1a"
              level="M"
              className={styles.qr}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.cardId}>ID {user.id.slice(-8).toUpperCase()}</span>
          <span className={styles.tagline}>{t('passport.cardTagline')}</span>
        </div>
      </div>

      <Button onClick={handleDownload} disabled={isDownloading} className={styles.downloadBtn}>
        <Download size={16} strokeWidth={2} />
        {isDownloading ? t('common.loading') : t('passport.downloadCard')}
      </Button>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

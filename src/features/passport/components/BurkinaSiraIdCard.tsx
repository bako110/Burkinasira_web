import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Download, User, BadgeCheck } from 'lucide-react';

import { Button } from '../../../shared/ui';
import { useToastStore } from '../../../store/toast.store';
import { useCardToken } from '../../auth/hooks/useCardToken';
import type { UserPublic } from '../../../shared/api/types';
import { drawIdCard, loadImage } from './drawIdCard';
import styles from './BurkinaSiraIdCard.module.css';

interface BurkinaSiraIdCardProps {
  user: UserPublic;
  points: number;
}

const PUBLIC_SITE_URL = 'https://burkinasira.com';

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

export function BurkinaSiraIdCard({ user, points }: BurkinaSiraIdCardProps) {
  const { t, i18n } = useTranslation();
  const push = useToastStore((s) => s.push);
  const { data: cardTokenData } = useCardToken();
  const qrCanvasRef = useRef<HTMLDivElement>(null);
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

  const roleLabel = t(`auth.role${capitalize(user.role)}`, user.role);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      // Le QR est rendu dans un <canvas> caché par qrcode.react : on lit ses pixels.
      const qrCanvas = qrCanvasRef.current?.querySelector('canvas') ?? null;

      const [watermark, avatar] = await Promise.all([
        loadImage('/logo.png'),
        avatarDataUrl ? loadImage(avatarDataUrl) : Promise.resolve(null),
      ]);

      const out = document.createElement('canvas');
      drawIdCard(out, {
        fullName: user.full_name,
        roleLabel,
        memberSinceLabel: t('passport.memberSince', { date: memberSince }),
        pointsLabel: `${t('passport.points')} : ${points.toLocaleString('fr-FR')}`,
        cardLabel: t('passport.cardLabel'),
        tagline: t('passport.cardTagline'),
        isVerified: Boolean(user.is_verified),
        avatar,
        watermark,
        qr: qrCanvas,
      });

      const dataUrl = out.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `burkinasira-carte-${user.full_name.replace(/\s+/g, '-').toLowerCase()}.png`;
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
      {/* Aperçu à l'écran */}
      <div className={styles.card}>
        <img src="/logo.png" alt="" className={styles.watermark} />

        <div className={styles.header}>
          <span className={styles.brand}>BurkinaSira</span>
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
            <span className={styles.role}>{roleLabel}</span>
            <span className={styles.meta}>{t('passport.memberSince', { date: memberSince })}</span>
            <span className={styles.meta}>
              {t('passport.points')} : {points.toLocaleString('fr-FR')}
            </span>
          </div>

          <div className={styles.qrWrap}>
            {cardTokenData && (
              <QRCodeSVG
                value={`${PUBLIC_SITE_URL}/verify/${cardTokenData.card_token}`}
                size={76}
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                level="M"
                className={styles.qr}
              />
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.tagline}>{t('passport.cardTagline')}</span>
        </div>
      </div>

      {/* QR en <canvas> hors écran, uniquement pour l'export PNG */}
      <div ref={qrCanvasRef} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {cardTokenData && (
          <QRCodeCanvas
            value={`${PUBLIC_SITE_URL}/verify/${cardTokenData.card_token}`}
            size={420}
            bgColor="#ffffff"
            fgColor="#1a1a1a"
            level="M"
          />
        )}
      </div>

      <Button onClick={handleDownload} disabled={isDownloading || !cardTokenData} className={styles.downloadBtn}>
        <Download size={16} strokeWidth={2} />
        {isDownloading ? t('common.loading') : t('passport.downloadCard')}
      </Button>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
